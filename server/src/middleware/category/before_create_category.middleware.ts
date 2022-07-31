import { Category, CategoryModel } from '@/database'
import { RequestHandler } from 'express'

export const beforeCreateCategory: RequestHandler = async (req, res, next) => {
  const data: Category = req.body

  let isExist = !!(await CategoryModel.findOne({
    shop: data.shop,
    slug: data.slug,
  }))

  if (isExist) {
    return req.sendError({
      code: 422,
      message: `dupplicate slug '${data.slug}'`,
    })
  }

  next()
}
