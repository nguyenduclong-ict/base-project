import { Router } from 'express'
import Config from '../config'

const { spaPaths, ssrPaths } = Config

const router = Router()

spaPaths?.forEach(path => {
  router.use(path, (req, res, next) => {
    req.spa = true
    next()
  })
})

ssrPaths?.forEach(path => {
  router.use(path, (req, res, next) => {
    req.spa = false
    next()
  })
})

export default router
