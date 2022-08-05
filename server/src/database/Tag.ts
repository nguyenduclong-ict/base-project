import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Shop } from './Shop'

export enum TagType {
  IMPORT = 'IMPORT', // Nhập hàng
  CUSTOMER = 'CUSTOMER', // Khách hàng
  STOCK_ADJUSTMENT = 'STOCK_ADJUSTMENT', // Kiểm kho
  STOCK_STRANSFER = 'STOCK_STRANSFER', // Chuyển hàng
  PROVIDER = 'PROVIDER', // Nhà cung cấp
  PRODUCT = 'PRODUCT',
}

class Tag {
  @field({ type: String, required: true })
  value: string

  @field({ type: String, enum: Object.values(TagType), required: true })
  type: TagType

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  shop: Shop

  createdAt?: Date
  updatedAt?: Date
}

const TagSchema = new Schema<Tag>(
  {
    ...getSchemaDefinition(Tag),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(TagSchema)

const TagModel = registerModel<Tag>('Tag', TagSchema)
const TagTools = { model: TagModel }

export { Tag, TagSchema, TagModel, TagTools }
