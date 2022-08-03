import { ShopSettingModel } from '@/database/Shop/ShopSetting'
import { registerRestApi } from '@/helpers'
import { isAuthenticated, isShopMember } from '@/middleware'
import { Router } from 'express'
const router = Router()

router.use(isAuthenticated, isShopMember())

registerRestApi(router, ShopSettingModel, {
  middlewares: {},
  actions: ['find', 'findOne', 'list', 'update'],
})

export default router
