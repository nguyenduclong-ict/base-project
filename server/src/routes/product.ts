import { ProductModel } from '@/db'
import { registerRestApi } from '@/helpers'
import { Router } from 'express'
const router = Router()

registerRestApi(router, ProductModel)

export default router
