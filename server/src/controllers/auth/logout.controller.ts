import { RequestHandler } from 'express'

export const logoutController: RequestHandler = async (req, res, next) => {
  res.status(200).send()
}
