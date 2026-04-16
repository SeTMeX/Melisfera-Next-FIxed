import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

// GET user favorites
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)

    const favorites = await prisma.favorite.findMany({
      where: { userId: decoded.sub },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to match frontend format
    const transformedFavorites = favorites.map(fav => ({
      id: fav.product.id,
      name: fav.product.name as any,
      description: fav.product.description as any,
      price: `${fav.product.price} MDL`,
      images: fav.product.images as any,
      imageColor: fav.product.imageColor,
      badge: fav.product.badge as any,
      details: fav.product.details as any
    }))

    return NextResponse.json(transformedFavorites)
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST add to favorites
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if already in favorites
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: decoded.sub,
          productId
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json({ error: 'Product already in favorites' }, { status: 409 })
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: decoded.sub,
        productId
      }
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
