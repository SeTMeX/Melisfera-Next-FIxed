import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1)
  })),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string()
  })
})

// GET user orders
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)

    const orders = await prisma.order.findMany({
      where: { userId: decoded.sub },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to match frontend format
    const transformedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
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
    }))

    return NextResponse.json(transformedOrders)
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create order
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)

    // Calculate total amount and validate products
    let totalAmount = 0
    const orderItems: Array<{
      productId: string
      quantity: number
      price: number
    }> = []

    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product || !product.inStock) {
        return NextResponse.json(
          { error: `Product ${item.productId} not available` },
          { status: 400 }
        )
      }

      totalAmount += product.price * item.quantity
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      })
    }

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: decoded.sub,
          status: 'pending',
          totalAmount,
          shippingAddress: JSON.stringify(validatedData.shippingAddress)
        }
      })

      // Create order items
      for (const item of orderItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }
        })
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: {
          userId: decoded.sub,
          productId: { in: validatedData.items.map(item => item.productId) }
        }
      })

      return newOrder
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    
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
