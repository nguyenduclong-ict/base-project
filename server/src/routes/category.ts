import { CategoryModel } from '@/database'
import { registerRestApi } from '@/helpers'
import { isAuthenticated, isShopMember } from '@/middleware'
import { Router } from 'express'
const router = Router()

router.use(isAuthenticated, isShopMember())

registerRestApi(router, CategoryModel)

export default router
