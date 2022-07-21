import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import { validate, ValidationError, getMetadataStorage } from 'class-validator'
import { RequestHandler } from 'express'

const metaDataStorage = getMetadataStorage()

function getErrorMessage(error: ValidationError, path: string = ''): string {
  let message = ''
  if (error.children.length) {
    message = getErrorMessage(error.children[0], error.property)
  } else {
    message = Object.values(error.constraints).pop()
  }
  if (path) message = `${path}.${message}`
  return message
}

export function createValidate(
  entityClass: any,
  target: 'body' | 'query' | 'params'
): RequestHandler {
  const m = metaDataStorage.getTargetValidationMetadatas(
    entityClass,
    entityClass.constructor.name,
    true,
    false
  )

  const dto = metaDataStorage.groupByPropertyName(m)

  const FunctionValidator: RequestHandler = async (req, res, next) => {
    const raw = req[target]
    const data = plainToClass(entityClass, raw)

    const errors = await validate(data, { stopAtFirstError: true })
    if (errors.length > 0) {
      return res.status(422).json({
        code: 422,
        target,
        message: getErrorMessage(errors[0]),
        error: errors[0],
      })
    } else {
      req[target] = data
    }

    next()
  }

  ;(FunctionValidator as any).dto = dto
  ;(FunctionValidator as any).target = target

  return FunctionValidator
}
