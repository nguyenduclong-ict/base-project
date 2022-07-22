import { RequestHandler } from 'express'
import qs from 'qs'
const url = require('url')

export const ParaseQuery: RequestHandler = async (req, res, next) => {
  const queryString = url.parse(req.url).query
  req.query = qs.parse(queryString)
  next()
}
