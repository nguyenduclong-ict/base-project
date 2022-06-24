import { UserModel } from '@/db'
import { verifyToken } from '@/helpers'
import consola from 'consola'
import { RequestHandler } from 'express'

export const getUser: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null

  if (token) {
    req.token = token
    try {
      const tokenData = await verifyToken(token)
      if (tokenData.userId) {
        const user = await UserModel.findOne({
          _id: tokenData.userId,
        })
          .populate('roles')
          .populate('shops')
        req.user = user.toJSON()
      }
    } catch (error) {
      consola.error(error)
    }
  }

  next()
}

const _isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.tokenData && !req.user) {
    return req.sendError({ code: 401, message: 'INVALID TOKEN' })
  }
  next()
}

export const isAuthenticated = [getUser, _isAuthenticated]

const _isAdmin: RequestHandler = async (req, res, next) => {
  if (!req.user.is_admin) {
    return req.sendError({ code: 403, message: 'User not have permission' })
  }
  next()
}

export const isAdmin = [isAuthenticated, _isAdmin]

// have permission middleware
export const hasPermisison: (...permissions: string[]) => RequestHandler = (
  ...permissions: string[]
) => {
  const handler: RequestHandler = async (req, res, next) => {
    if (
      !req.user.roles.some((role) =>
        role.permissions.some((permission) => permissions.includes(permission))
      )
    ) {
      return req.sendError({
        code: 403,
        message: 'User not have permission',
      })
    }
    next()
  }
  return [isAuthenticated, handler] as any
}

// have permission middleware

export const hasRole: (...roles: string[]) => RequestHandler = (
  ...roles: string[]
) => {
  const handler: RequestHandler = async (req, res, next) => {
    if (!req.user.roles.some((role) => roles.includes(role.uid))) {
      return req.sendError({
        code: 403,
        message: 'User not have permission',
      })
    }
    next()
  }
  return [isAuthenticated, handler] as any
}
