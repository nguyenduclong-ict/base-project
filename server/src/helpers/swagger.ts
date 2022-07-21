import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import urlJoin from './lib/url-join'

export function setUpSwagger(app: Express) {
  const routes: any[] = []

  function listRoutes(middleware: any, rootPath = '/') {
    if (middleware.name === 'router') {
      middleware.handle.stack.forEach(function (handler: any) {
        if (handler.route) {
          routes.push({
            ...handler.route,
            path: urlJoin(rootPath, handler.route.path),
            method: Object.keys(handler.route.methods).find(
              (k) => handler.route.methods[k] === true
            ),
          })
        } else {
          listRoutes(handler, urlJoin(rootPath, handler.__mountpath || '/'))
        }
      })
    }
  }

  app._router.stack.forEach((stack: any) => listRoutes(stack))

  const swaggerDocuments: any = {
    swagger: '2.0',
    schemes: ['https', 'http'],
    paths: {},
  }

  routes.forEach((route) => {
    const item: any = {}
    route.stack.forEach((stack: any) => {
      if (stack.name === 'FunctionValidator') {
        const h = stack.handle
        // console.log(h.dto)
        if (h.target === 'query') {
          item.query = item.query || {}
        }

        if (h.target === 'body') {
          const body: any = {
            in: 'body',
            name: 'body',
            schema: {
              type: 'object',
              properties: {},
            },
          }
          item.parameters = [body]
          Object.keys(h.dto).forEach((key) => {
            body.schema.properties[key] = {}
          })
        }
      }
    })
    swaggerDocuments.paths[route.path] =
      swaggerDocuments.paths[route.path] || {}
    Object.assign(swaggerDocuments.paths[route.path], {
      [route.method]: item,
    })
  })

  app.get('/api-docs/swagger.json', (req, res) => {
    res.json(swaggerDocuments)
  })

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(null, {
      explorer: true,
      swaggerOptions: {
        url: '/api-docs/swagger.json',
      },
    })
  )
}
