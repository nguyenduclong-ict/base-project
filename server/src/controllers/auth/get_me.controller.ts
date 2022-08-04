import { ShopModel } from '@/database'
import { objectIdToString } from '@/helpers'
import { RequestHandler } from 'express'
import _, { omit } from 'lodash'

export const handler: RequestHandler = async (req, res, next) => {
  const shopIds = _.uniq(
    req.user.roles.flatMap((role) => role.shops.map(objectIdToString))
  )

  const shops = await ShopModel.find({
    _id: { $in: shopIds },
  })

  req.user.shops = shops
  res.json(omit(req.user, 'password'))
}

export const getMeController = [handler]
