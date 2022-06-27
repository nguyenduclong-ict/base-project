import { UserModel } from '@/db'
import { compareObjectId, verifyToken } from '@/helpers'
import consola from 'consola'
import { RequestHandler } from 'express'
import { get } from 'lodash'

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
        }).populate({ path: 'roles' })
        req.user = user.toJSON() as any
      }
    } catch (error) {
      consola.error(error)
    }
  }

  next()
}

/**
 * Check user request is memeber of shop
 * @param shopIdPath
 * @returns
 */
export const isShopMember = function (shopIdPath?: string): RequestHandler {
  return async (req, res, next) => {
    const shopId = shopIdPath
      ? get(req, shopIdPath)
      : get(req.params, 'shop_id') ||
        get(req.query, 'shop_id') ||
        get(req.body, 'shop_id') ||
        get(req.params, 'shop') ||
        get(req.query, 'shop') ||
        get(req.body, 'shop')

    const shop = req.user.roles.find((role) =>
      compareObjectId(role.shop, shopId)
    )

    if (!shop) {
      return req.sendError({
        code: 401,
        type: 'NOT_HAS_PERMISSION_IN_SHOP',
        message: "User don't have permission to access the shop",
      })
    }

    req.shopId = shopId
    req.shop = shop
    next()
  }
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
export const hasPermisison = (...permissions: string[]) => {
  const handler: RequestHandler = async (req, res, next) => {
    const shopId = req.shopId
    const roles = req.user.roles

    let pass
    for (const role of roles) {
      pass =
        (shopId ? shopId === role.shop.id : true) &&
        (role.full_permission ||
          permissions.some((p) => role.permissions.includes(p)))

      if (pass) break
    }

    if (pass) return next()
    else {
      return req.sendError({
        code: 403,
        type: 'PERMISSION_DENIED',
        message: `require permisison ${permissions.join(',')}`,
      })
    }
  }
  return [isAuthenticated, handler] as any
}
