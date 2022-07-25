import { sendError } from '@/helpers'
import { getUser, isAuthenticated } from '@/middleware'
import { ParaseQuery } from '@/middleware/params.middleware'
import { Router } from 'express'
import authRoutes from './auth'
import categoryRoutes from './category'
import productRoutes from './product'
import mediaRouters from './media'

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

export default router
