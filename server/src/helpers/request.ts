import { RequestHandler, Response, Router } from 'express'
import { findDocuments, listDocuments } from './mongo'
import { Model } from 'mongoose'
import _ from 'lodash'
import { resolve as resolveUrl } from 'url'

export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<string, never>)

export const sendError = (
  res: Response,
  error: { code?: number; message?: string; data?: any } = {}
) => {
  return res
    .status(error.code || 500)
    .json({ code: error.code, message: error.message, data: error.data })
}

export const listEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res, next) => {
    let query = {}

    if (req.query.query) {
      try {
        query = JSON.parse(req.query.query as string)
      } catch (error) {}
    }

    const result = await listDocuments(model, {
      query,
      page: req.query.page as any,
      pageSize: req.query.pageSize as any,
      populates: req.query.populates as any,
      sort: req.query.sort as any,
      select: req.query.select as any,
      search: req.query.search as any,
    })

    res.json(result)
  }
}

export const findEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res, next) => {
    let query = {}

    if (req.query.query) {
      try {
        query = JSON.parse(req.query.query as string)
      } catch (error) {}
    }

    const result = await findDocuments(model, {
      query,
      page: req.query.page as any,
      populates: req.query.populates as any,
      sort: req.query.sort as any,
      select: req.query.select as any,
      search: req.query.search as any,
    })

    res.json(result)
  }
}

export const updateEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res, next) => {
    const id = req.params.id

    try {
      const entity = await model.findById(id)
      if (!entity) {
        return next({ code: 404, message: 'Entity not exists!' })
      }
      Object.assign(entity, _.omit(req.body, 'id'))
      await entity.save()
      return res.json(entity)
    } catch (error: any) {
      return next({ code: 500, message: error.message || error.name })
    }
  }
}

export const createEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res, next) => {
    try {
      const entity = await model.create(req.body)
      return res.json(entity)
    } catch (error: any) {
      return next({ code: 500, message: error.message || error.name })
    }
  }
}

export const deleteEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res, next) => {
    try {
      const ids = req.params.id.split('+').map((id) => id.trim())

      if (ids.length === 0) {
        return res.json({
          deletedCount: 0,
        })
      }

      const result = await model.deleteMany({ _id: { $in: ids } }, {})
      res.json(result)
    } catch (error: any) {
      console.error('deleteEntityController error', error)
      return next({ code: 500, message: error.message || error.name })
    }
  }
}

type RestMethod = 'list' | 'create' | 'update' | 'find' | 'delete'

export const registerRestApi = (
  router: Router,
  model: Model<any>,
  path = '/',
  actions: LiteralUnion<RestMethod>[] = [
    'list',
    'create',
    'update',
    'find',
    'delete',
  ]
) => {
  actions.forEach((action) => {
    if (action === 'create') {
      router.post(path, createEntityController(model))
    }
    if (action === 'list') {
      router.get(path, listEntityController(model))
    }
    if (action === 'find') {
      router.get(resolveUrl(path, 'find'), findEntityController(model))
    }
    if (action === 'update') {
      router.put(resolveUrl(path, ':id'), updateEntityController(model))
    }
    if (action === 'delete') {
      router.delete(resolveUrl(path, ':id'), deleteEntityController(model))
    }
  })
}
