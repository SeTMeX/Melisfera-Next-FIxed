import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const addFundsSchema = z.object({
  amount: z.number().positive(),
  description: z.string().optional()
})

// GET user wallet balance and transactions
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        balance: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: decoded.sub },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to last 50 transactions
    })

    return NextResponse.json({
      balance: user.balance,
      transactions
    })
  } catch (error) {
    console.error('Get wallet error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST add funds to wallet
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const body = await request.json()
    const validatedData = addFundsSchema.parse(body)

    // Update user balance and create transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: decoded.sub },
        data: {
          balance: {
            increment: validatedData.amount
          }
        },
        select: {
          balance: true
        }
      })

      const transaction = await tx.transaction.create({
        data: {
          userId: decoded.sub,
          type: 'deposit',
          amount: validatedData.amount,
          description: validatedData.description || `Added ${validatedData.amount} MDL to wallet`
        }
      })

      return {
        balance: updatedUser.balance,
        transaction
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Add funds error:', error)
    
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
