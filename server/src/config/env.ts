import { envTool } from '@/helpers/env'
import consola from 'consola'

export const ENV = {
  PORT: envTool.parseNumber(process.env.PORT) || 3000,
  HOST: process.env.HOST || 'localhost',
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_HOST: envTool.parseString(process.env.MONGO_HOST),
  MONGO_DATABASE: process.env.MONGO_DATABASE,
  MONGO_AUTH_SOURCE: process.env.MONGO_AUTH_SOURCE,
  MONGO_REPLICASET: process.env.MONGO_REPLICASET,
  MONGO_PORT: envTool.parseNumber(process.env.MONGO_PORT) || 27017,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  S3_REGION: process.env.S3_REGION || 'ap-southeast-1',
  S3_ENDPOINT: process.env.S3_ENDPOINT || 'http://localhost:9000',
  JWT_SECERT: process.env.JWT_SECERT,
  API_URL: process.env.API_URL,
  GHN_TOKEN: process.env.GHN_TOKEN,
  REDIS_URL: process.env.REDIS_URL,
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

Object.keys(ENV).forEach((key) => {
  requireEnv(key as any)
})
