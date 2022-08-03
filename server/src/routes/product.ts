import { createProductController } from '@/controllers/product/create_product.controller'
import { ProductModel } from '@/database'
import { registerRestApi } from '@/helpers'
import { hasPermisison, isShopMember } from '@/middleware'
import { Router } from 'express'
const router = Router()

router.post(
  '/',
  isShopMember(),
  hasPermisison('create_product'),
  createProductController
)

registerRestApi(router, ProductModel, {
  actions: ['find', 'findOne', 'list', 'update'],
})

export default router
