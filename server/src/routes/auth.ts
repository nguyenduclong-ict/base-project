import {
  getMeController,
  loginController,
  logoutController,
  refreshTokenController,
} from '@/controllers'
import { isAuthenticated } from '@/middleware'
import { Router } from 'express'

const router = Router()

router.post('/login', loginController)
router.get('/me', isAuthenticated, getMeController)
router.post('/logout', isAuthenticated, logoutController)
router.post('/refresh', refreshTokenController)

export default router
