import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { model, Schema, SchemaTypes } from 'mongoose'
import { Shop } from '../Shop'

/** Thuộc tính của sản phẩm */

export class ProductAttributeValue {
  @field({ type: SchemaTypes.String })
  name: string

  @field({ type: SchemaTypes.String })
  slug: string

  @field({ type: SchemaTypes.Mixed, default: [] })
  value: any
}

const productAttribiuteValueSchema = new Schema(
  getSchemaDefinition(ProductAttributeValue)
)

class ProductAttribute {
  id?: any
  _id?: any

  @field({ type: SchemaTypes.String })
  name: string

  @field({ type: SchemaTypes.String })
  slug: string

  @field({
    type: SchemaTypes.Mixed,
    childSchemas: [
      {
        schema: productAttribiuteValueSchema,
        model: model(ProductAttributeValue.name, productAttribiuteValueSchema),
      },
    ],
  })
  values: ProductAttributeValue[]

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  shop: Shop

  createdAt?: Date | undefined
  updatedAt?: Date | undefined
}

const ProductAttributeSchema = new Schema<ProductAttribute>(
  { ...getSchemaDefinition(ProductAttribute) },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(ProductAttributeSchema)

const ProductAttributeModel = registerModel(
  'ProductAttribute',
  ProductAttributeSchema
)
const ProductAttributeTools = {}

export {
  ProductAttribute,
  ProductAttributeSchema,
  ProductAttributeModel,
  ProductAttributeTools,
}
