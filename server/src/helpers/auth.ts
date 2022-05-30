import bcrypt from 'bcrypt'
const saltRounds = 10

export function hasPassword(plainPassword: string) {
  return bcrypt.hash(plainPassword, saltRounds)
}

export function comparePassword(plainPassword: string, hashed: string) {
  return bcrypt.compare(plainPassword, hashed)
}
