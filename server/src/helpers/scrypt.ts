import { ENV } from '@/config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const saltRounds = 10

export function hashPassword(plainPassword: string) {
  return bcrypt.hash(plainPassword, saltRounds)
}

export function comparePassword(plainPassword: string, hashed: string) {
  return bcrypt.compare(plainPassword, hashed)
}

export function generateLoginToken(userId: any) {
  return jwt.sign({ userId }, ENV.JWT_SECERT, { expiresIn: '30m' })
}

export function verifyToken(token: string): any {
  return jwt.verify(token, ENV.JWT_SECERT)
}

export function generateRefreshToken(userId: any) {
  return jwt.sign({ userId }, ENV.JWT_SECERT)
}
