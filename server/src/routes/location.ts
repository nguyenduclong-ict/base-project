import { LocationModel } from '@/database'
import { registerRestApi } from '@/helpers'
import { isAdmin, isAuthenticated } from '@/middleware'
import { provinceQueue } from '@/queues/crawl_address'
import { Router } from 'express'
const router = Router()

router.post(
  '/crawl',
  isAuthenticated,
  isAdmin,
  async (req: any, res: any, next: any) => {
    await provinceQueue.add({}, { attempts: 0 })
    res.json({ status: 'running' })
  }
)

registerRestApi(router, LocationModel, {
  actions: ['list', 'find'],
})

export default router
