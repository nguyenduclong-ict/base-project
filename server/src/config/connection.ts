import { envTool } from '@/helpers/env'

import { createConnection } from 'mongoose'
import { ENV } from './env'
import consola from 'consola'

envTool.requireEnv(ENV.MONGO_HOST, 'env `MONGO_HOST` is required')
envTool.requireEnv(ENV.MONGO_USER, 'env `MONGO_USER` is required')
envTool.requireEnv(ENV.MONGO_PASSWORD, 'env `MONGO_PASSWORD` is required')
envTool.requireEnv(ENV.MONGO_HOST, 'env `MONGO_HOST` is required')
envTool.requireEnv(ENV.MONGO_DATABASE, 'env `MONGO_DATABASE` is required')

const connection = createConnection(
  `mongodb://${ENV.MONGO_HOST}:${ENV.MONGO_PORT}`,
  {
    user: ENV.MONGO_USER,
    pass: ENV.MONGO_PASSWORD,
    dbName: ENV.MONGO_DATABASE,
    authSource: ENV.MONGO_AUTH_SOURCE || ENV.MONGO_DATABASE,
    replicaSet: ENV.MONGO_REPLICASET,
    directConnection: true,
  }
)

const waitForConnectionReady = () => {
  if (connection.readyState === 1) return Promise.resolve(true)
  return new Promise((resolve, reject) => {
    connection.on('connected', () => {
      if (connection.readyState === 1) {
        consola.success(`mongoose connected to ${ENV.MONGO_DATABASE}`)
        resolve(true)
      }
    })
    connection.on('error', reject)
  })
}

export { connection, waitForConnectionReady }
