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
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id }
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
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    // Convert object fields to JSON strings for Prisma
    const updateData = {
      ...validatedData,
      name: validatedData.name ? JSON.stringify(validatedData.name) : undefined,
      description: validatedData.description ? JSON.stringify(validatedData.description) : undefined,
      images: validatedData.images ? JSON.stringify(validatedData.images) : undefined,
      badge: validatedData.badge ? JSON.stringify(validatedData.badge) : undefined,
      details: validatedData.details ? JSON.stringify(validatedData.details) : undefined,
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE product (admin only) - FIXED VERSION
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  console.log('DELETE request received:', {
    id,
    params,
    token: request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
  });

  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // First, check if product exists
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete related records first to avoid foreign key constraints
    await prisma.orderItem.deleteMany({
      where: { productId: id }
    })

    await prisma.favorite.deleteMany({
      where: { productId: id }
    })

    await prisma.cartItem.deleteMany({
      where: { productId: id }
    })

    // Then delete the product
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'Product and all related records deleted successfully',
      deletedId: id
    })
  } catch (error) {
    console.error('Delete product error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
