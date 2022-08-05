import { TagModel } from '@/database'
import { registerRestApi } from '@/helpers'
import { Router } from 'express'
const router = Router()

registerRestApi(router, TagModel)

export default router
