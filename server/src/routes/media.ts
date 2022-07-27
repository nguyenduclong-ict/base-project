import { upload } from '@/config/multer'
import { getFileController } from '@/controllers/media/get_file.controller'
import { uploadController } from '@/controllers/media/upload.controller'
import { MediaModel } from '@/database'
import { listEntityController } from '@/helpers'
import { getUser, isAuthenticated, isShopMember } from '@/middleware'
import { Router } from 'express'
const router = Router()

router.get(
  '/list',
  isAuthenticated,
  isShopMember('query.shop_id'),
  listEntityController(MediaModel)
)
router.get(/.*/, getFileController)
router.post(
  '/upload',
  getUser,
  upload.single('file'),
  isShopMember('body.shop_id', false),
  uploadController
)

export default router
