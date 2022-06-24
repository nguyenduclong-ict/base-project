import { Router } from 'express'
import productRoutes from './product'
import categoryRoutes from './category'
import authRoutes from './auth'
import { sendError } from '@/helpers'
import { isAuthenticated } from '@/middleware'
import { connection } from '@/config'
import { CategoryModel } from '@/db'

const router = Router()
router.use((req, res, next) => {
  req.sendError = sendError.bind(req)
  next()
})

router.use('/auth', authRoutes)
router.use('/product', isAuthenticated, productRoutes)
router.use('/category', isAuthenticated, categoryRoutes)

export default router
