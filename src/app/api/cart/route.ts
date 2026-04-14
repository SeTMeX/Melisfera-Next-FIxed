import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

// GET user cart
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: decoded.id },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to match frontend format
    const transformedCartItems = cartItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name as any,
        description: item.product.description as any,
        price: `${item.product.price} MDL`,
        images: item.product.images as any,
        imageColor: item.product.imageColor,
        badge: item.product.badge as any,
        details: item.product.details as any
      }
    }))

    return NextResponse.json(transformedCartItems)
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST add to cart or update quantity
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const { productId, quantity } = await request.json()

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Product ID and quantity are required' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Upsert cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: decoded.id,
          productId
        }
      },
      update: {
        quantity
      },
      create: {
        userId: decoded.id,
        productId,
        quantity
      },
      include: {
        product: true
      }
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
