import { sendError } from '@/helpers'
import { isAuthenticated } from '@/middleware'
import { ParaseQuery } from '@/middleware/params.middleware'
import { Router } from 'express'
import mediaAttributes from './attribute'
import authRoutes from './auth'
import categoryRoutes from './category'
import mediaRouters from './media'
import productRoutes from './product'
import importRoutes from './warehouse/import'

const router = Router()

router.use(ParaseQuery)

router.use((req, res, next) => {
  req.sendError = sendError.bind(req)
  next()
})

router.use('/auth', authRoutes)
router.use('/product', isAuthenticated, productRoutes)
router.use('/category', isAuthenticated, categoryRoutes)
router.use('/media', mediaRouters)
router.use('/attribute', mediaAttributes)
router.use('/warehouse/import', importRoutes)

export default router
