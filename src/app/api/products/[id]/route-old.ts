import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const updateProductSchema = z.object({
  name: z.object({ ro: z.string(), en: z.string() }).optional(),
  description: z.object({ ro: z.string(), en: z.string() }).optional(),
  price: z.number().positive().optional(),
  images: z.array(z.string()).optional(),
  imageColor: z.string().optional(),
  badge: z.object({ ro: z.string(), en: z.string() }).optional(),
  details: z.object({ ro: z.array(z.string()), en: z.array(z.string()) }).optional(),
  inStock: z.boolean().optional()
})

// GET single product (public)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Transform product to match frontend format
    const transformedProduct = {
      id: product.id,
      name: product.name as any,
      description: product.description as any,
      price: `${product.price} MDL`,
      images: product.images as any,
      imageColor: product.imageColor,
      badge: product.badge as any,
      details: product.details as any
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update product (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    const validatedData = updateProductSchema.parse(body)

    const product = await prisma.product.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Update product error:', error)
    
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

// DELETE product (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
