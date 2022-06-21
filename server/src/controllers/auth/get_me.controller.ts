import { RequestHandler } from 'express'
import { omit } from 'lodash'

export const handler: RequestHandler = async (req, res, next) => {
  res.json(omit(req.user, 'password'))
}

export const getMeController = [handler]
