import { Model, SchemaDefinitionProperty } from 'mongoose'

export interface Entity {
  _id?: any
  id?: any
}

export interface EntityTimestamp {
  createdAt?: Date
  updatedAt?: Date
}

// decorators
export function field(
  options?: SchemaDefinitionProperty | SchemaDefinitionProperty[]
) {
  return function (target: any, propertyKey: string) {
    if (options) target[propertyKey] = options
  }
}

export const getSchemaDefinition = (entityClass: any) => {
  const definition = {} as any
  Object.keys(entityClass.prototype).forEach((key) => {
    if (entityClass.prototype[key]) definition[key] = entityClass.prototype[key]
  })
  return definition
}
