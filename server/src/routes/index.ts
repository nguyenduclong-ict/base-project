import { sendError } from '@/helpers'
import { isAuthenticated } from '@/middleware'
import { ParaseQuery } from '@/middleware/params.middleware'
import { Router } from 'express'
import authRoutes from './auth'
import categoryRoutes from './category'
import locationRoutes from './location'
import mediaRouters from './media'
import productRoutes from './product'
import shopRoutes from './shop'
import tagRoutes from './tag'
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
router.use('/warehouse/import', importRoutes)
router.use('/location', locationRoutes)
router.use('/shop', shopRoutes)
router.use('/tag', tagRoutes)

/**
 * 404 error
 */
router.use((req, res, next) => {
  req.sendError({ code: 404, message: 'Not Found' })
})

export default router
