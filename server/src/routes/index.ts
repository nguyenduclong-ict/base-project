import { sendError } from '@/helpers'
import { isAuthenticated } from '@/middleware'
import { Router } from 'express'
import authRoutes from './auth'
import categoryRoutes from './category'
import productRoutes from './product'

const router = Router()
router.use((req, res, next) => {
  req.sendError = sendError.bind(req)
  next()
})

router.use('/auth', authRoutes)
router.use('/product', isAuthenticated, productRoutes)
router.use('/category', isAuthenticated, categoryRoutes)

export default router
