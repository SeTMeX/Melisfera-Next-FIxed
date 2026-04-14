import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Debug endpoint pentru a vedea toate datele
export async function GET(request: NextRequest) {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        balance: true,
        createdAt: true
      }
    })

    // Get all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        inStock: true,
        createdAt: true
      }
    })

    // Get all orders
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // Get database stats
    const stats = {
      totalUsers: await prisma.user.count(),
      totalProducts: await prisma.product.count(),
      totalOrders: await prisma.order.count(),
      totalRevenue: await prisma.order.aggregate({
        _sum: { totalAmount: true }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        users,
        products,
        orders,
        stats
      }
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
