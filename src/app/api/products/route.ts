import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const createProductSchema = z.object({
  name: z.object({ ro: z.string(), en: z.string() }),
  description: z.object({ ro: z.string(), en: z.string() }),
  price: z.number().positive(),
  images: z.array(z.string()),
  imageColor: z.string(),
  badge: z.object({ ro: z.string(), en: z.string() }).optional(),
  details: z.object({ ro: z.array(z.string()), en: z.array(z.string()) }),
  inStock: z.boolean().default(true)
})

// GET all products (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'ro'
    const inStockOnly = searchParams.get('inStockOnly') === 'true'

    const products = await prisma.product.findMany({
      where: inStockOnly ? { inStock: true } : {},
      orderBy: { createdAt: 'desc' }
    })

    // Transform products to match frontend format
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name as any,
      description: product.description as any,
      price: `${product.price} MDL`,
      images: product.images as any,
      imageColor: product.imageColor,
      badge: product.badge as any,
      details: product.details as any
    }))

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create product (admin only)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    const product = await prisma.product.create({
      data: validatedData
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
