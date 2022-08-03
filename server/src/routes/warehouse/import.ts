import { ImportModel } from '@/database'
import { registerRestApi } from '@/helpers'
import { Router } from 'express'
const router = Router()

registerRestApi(router, ImportModel, { actions: ['list', 'find', 'findOne'] })

export default router
