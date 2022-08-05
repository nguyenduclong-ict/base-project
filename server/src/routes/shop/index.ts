import { Constants } from '@/config/constants'
import { createShopController } from '@/controllers/shop/create_shop'
import { ShopModel } from '@/database'
import { updateEntityController } from '@/helpers'
import {
  hasPermisison,
  isAdmin,
  isAuthenticated,
  isShopMember,
} from '@/middleware'
import { Router } from 'express'
const router = Router()

router.post('/', isAuthenticated, isAdmin, createShopController)

router.put(
  '/:id',
  isAuthenticated,
  isShopMember('params.id'),
  hasPermisison(Constants.Permissions.UPDATE_SHOP),
  updateEntityController(ShopModel)
)

export default router
