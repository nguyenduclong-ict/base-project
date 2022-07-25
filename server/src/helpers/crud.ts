import { Request, RequestHandler, Response, Router } from 'express'
import {
  findDocuments,
  listDocuments,
  parseJSON,
  parsePopulateFromRequest,
} from './mongo'
import { Model } from 'mongoose'
import _ from 'lodash'
import { resolve as resolveUrl } from 'url'

export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<string, never>)

export function sendError(
  this: Request,
  error: { code?: number; message?: string; data?: any; type?: string } = {}
) {
  return this.res.status(error.code || 500).json({
    code: error.code,
    message: error.message,
    data: error.data,
    type: error.type,
  })
}

export const listEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res, next) => {
    console.log('listEntityController')
    try {
      let query: any = {}

      if (req.query.query) {
        try {
          query = JSON.parse(req.query.query as string)
        } catch (error) {}
      }

      // Inject shop query
      if (req.shopId) {
        query[req.shopId] = req.shopId
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
    } catch (error: any) {
      req.sendError({ code: 500, message: error.message || error.name })
    }
  }
}

export const findOneEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res, next) => {
    try {
      let query: any = {}

      if (req.query.query) {
        query = parseJSON(req.query.query)
      }

      // Inject shop query
      if (req.shopId) {
        query[req.shopId] = req.shopId
      }

      const queryBuilder = model.findOne(query)

      parsePopulateFromRequest(req.query.populates || []).forEach((item) => {
        queryBuilder.populate(item)
      })

      const result = await queryBuilder.exec()
      res.json(result)
    } catch (error: any) {
      req.sendError({ code: 500, message: error.message || error.name })
    }
  }
}

export const findEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res, next) => {
    try {
      let query: any = {}

      if (req.query.query) {
        try {
          query = JSON.parse(req.query.query as string)
        } catch (error) {}
      }

      // Inject shop query
      if (req.shopId) {
        query[req.shopId] = req.shopId
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
    } catch (error: any) {
      req.sendError({ code: 500, message: error.message || error.name })
    }
  }
}

export const updateEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res, next) => {
    const id = req.params.id

    try {
      const entity = await model.findById(id)
      if (!entity || (req.shopId && req.shopId !== entity.toJSON().shop)) {
        return next({ code: 404, message: 'Entity not exists!' })
      }

      Object.assign(entity, _.omit(req.body, 'id'))
      await entity.save()
      return res.json(entity)
    } catch (error: any) {
      req.sendError({ code: 500, message: error.message || error.name })
    }
  }
}

export const createEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res, next) => {
    try {
      const body: any = req.body
      if (req.shopId) {
        body.shop = req.shopId
      }
      const entity = await model.create(body)
      return res.json(entity)
    } catch (error: any) {
      req.sendError({ code: 500, message: error.message || error.name })
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

      const queryDelete: any = { _id: { $in: ids } }
      if (req.shopId) queryDelete.shop = req.shopId

      const result = await model.deleteMany(queryDelete, {})
      res.json(result)
    } catch (error: any) {
      console.error('deleteEntityController error', error)
      req.sendError({ code: 500, message: error.message || error.name })
    }
  }
}

type RestMethod = 'list' | 'create' | 'update' | 'find' | 'delete' | 'findOne'

export const registerRestApi = (
  router: Router,
  model: Model<any>,
  {
    path = '/',
    actions = ['list', 'create', 'update', 'find', 'findOne', 'delete'],
    middlewares = {},
  }: {
    path?: string
    actions?: LiteralUnion<RestMethod>[]
    middlewares?: { [k in RestMethod]?: any[] }
  } = {}
) => {
  actions.forEach((action) => {
    // create
    if (action === 'create') {
      router.post(
        path,
        ...(middlewares.create || []),
        createEntityController(model)
      )
    }
    // list
    else if (action === 'list') {
      router.get(path, ...(middlewares.list || []), listEntityController(model))
    }
    // find One
    else if (action === 'findOne') {
      router.get(
        resolveUrl(path, '/findone'),
        ...(middlewares.findOne || []),
        findOneEntityController(model)
      )
    }
    // find
    else if (action === 'find') {
      router.get(
        resolveUrl(path, '/find'),
        ...(middlewares.find || []),
        findEntityController(model)
      )
    }
    // update
    else if (action === 'update') {
      router.put(
        resolveUrl(path, '/:id'),
        ...(middlewares.update || []),
        updateEntityController(model)
      )
    }
    // delete
    else if (action === 'delete') {
      router.delete(
        resolveUrl(path, '/:id'),
        ...(middlewares.delete || []),
        deleteEntityController(model)
      )
    }
  })
}
