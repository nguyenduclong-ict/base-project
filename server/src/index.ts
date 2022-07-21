import '@/helpers/extends'
import 'dotenv/config'
import { ENV } from '@/config'
import consola from 'consola'
import cors from 'cors'
import express from 'express'
import http from 'http'
import morgan from 'morgan'
import { waitForConnectionReady } from './config'
import router from './routes'

import { setUpSwagger } from './helpers/swagger'

const app = express()
const server = http.createServer(app)

async function bootstrap() {
  await waitForConnectionReady()

  app.use(cors())
  app.use(express.json())
  app.use(morgan('dev'))
  app.use(express.static(__dirname + '/public'))
  app.use(router)

  if (process.env.NODE_ENV === 'development') {
    setUpSwagger(app)
  }

  server.listen(ENV.PORT, ENV.HOST, () => {
    consola.success(`server listen on http://${ENV.HOST}:${ENV.PORT}`)
  })
}

bootstrap()
