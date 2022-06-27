import { ShopModel } from '@/db'
import { objectIdToString } from '@/helpers'
import { RequestHandler } from 'express'
import { omit } from 'lodash'

export const handler: RequestHandler = async (req, res, next) => {
  const shops = await ShopModel.find({
    _id: { $in: req.user.roles.map((role) => objectIdToString(role.shop)) },
  })
  req.user.shops = shops
  res.json(omit(req.user, 'password'))
}

export const getMeController = [handler]
