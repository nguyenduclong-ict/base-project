import { LocationModel } from '@/database'
import { registerRestApi } from '@/helpers'
import { isAdmin } from '@/middleware'
import { provinceQueue } from '@/queues/crawl_address'
import { Router } from 'express'
const router = Router()

router.post('/crawl', ...(isAdmin as any), async (req, res, next) => {
  await provinceQueue.add({}, { attempts: 0 })
  res.json({ status: 'running' })
})

registerRestApi(router, LocationModel, {
  actions: ['list'],
})

export default router
