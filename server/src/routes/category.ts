import { CategoryModel } from '@/db'
import { registerRestApi } from '@/helpers'
import { Router } from 'express'
const router = Router()

registerRestApi(router, CategoryModel)

export default router
