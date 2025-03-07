import jwt, { JwtPayload } from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'default-secret-key'

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION || '1h',
  })
}

export const verifyToken = (token: string): JwtPayload | string => {
  try {
    return jwt.verify(token, SECRET_KEY)
  } catch (error) {
    console.error('Error verifying token:', error)
    throw new Error('Invalid or expired token')
  }
}
