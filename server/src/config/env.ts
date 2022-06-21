import { envTool } from '@/helpers/env'
import consola from 'consola'

export const ENV = {
  PORT: envTool.parseNumber(process.env.PORT) || 3000,
  HOST: process.env.HOST || 'localhost',
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_HOST: envTool.parseString(process.env.MONGO_HOST),
  MONGO_DATABASE: process.env.MONGO_DATABASE,
  MONGO_PORT: envTool.parseNumber(process.env.MONGO_PORT) || 27017,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  JWT_SECERT: process.env.JWT_SECERT,
}

export const requireEnv = (...keys: (keyof typeof ENV)[]) => {
  let error = false

  keys.forEach((key) => {
    if (!ENV[key]) {
      consola.error(`environment ${key} is required`)
      error = true
    }
  })

  if (error) process.exit(1)
}

requireEnv('JWT_SECERT')
