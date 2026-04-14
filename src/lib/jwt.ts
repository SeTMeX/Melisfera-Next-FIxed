import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'

export interface JWTPayload {
  sub: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export const generateToken = (user: User): string => {
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role
  }

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  } as any)
}

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
}
