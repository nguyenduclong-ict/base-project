import { createShopController } from '@/controllers/shop/create_shop'
import { isAdmin, isAuthenticated } from '@/middleware'
import { Router } from 'express'
const router = Router()

router.post('/', isAuthenticated, isAdmin, createShopController)

export default router
