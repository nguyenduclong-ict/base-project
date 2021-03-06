import { CategoryModel } from '@/database'
import { registerRestApi } from '@/helpers'
import { isAuthenticated, isShopMember } from '@/middleware'
import { beforeCreateCategory } from '@/middleware/category/before_create_category.middleware'
import { Router } from 'express'
const router = Router()

router.use(isAuthenticated, isShopMember())

registerRestApi(router, CategoryModel, {
  middlewares: { create: [beforeCreateCategory] },
})

export default router
