import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

// DELETE remove from favorites
export async function DELETE(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: decoded.id,
          productId: params.productId
        }
      }
    })

    return NextResponse.json({ message: 'Product removed from favorites' })
  } catch (error) {
    console.error('Remove favorite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
