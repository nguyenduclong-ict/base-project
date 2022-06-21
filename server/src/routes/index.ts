import { Router } from 'express'
import productRoutes from './product'
import categoryRoutes from './category'
import authRoutes from './auth'
import { sendError } from '@/helpers'

const router = Router()
router.use((req, res, next) => {
  req.sendError = sendError.bind(req)
  next()
})

router.use('/auth', authRoutes)
router.use('/product', productRoutes)
router.use('/category', categoryRoutes)

export default router
