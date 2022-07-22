import { RequestHandler } from 'express'
import qs from 'qs'
const url = require('url')

export const ParaseQuery: RequestHandler = async (req, res, next) => {
  const queryString = req.url.slice(req.url.indexOf('?') + 1)
  req.query = qs.parse(queryString)
  next()
}
