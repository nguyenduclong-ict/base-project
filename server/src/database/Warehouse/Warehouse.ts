import { createSlug } from '@/helpers'
import {
  addTransformIdForSchema,
  getSchemaDefinition,
  registerModel,
  field,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Shop } from '../Shop'

/** Collection lưu trữ các kho hàng */

class Warehouse {
  @field({ type: String, required: true })
  name: string

  @field({ type: String })
  description: string

  @field({ type: String })
  address: string

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  shop: Shop

  createdAt?: Date | undefined
  updatedAt?: Date | undefined
}

const WarehouseSchema = new Schema<Warehouse>(
  {
    ...getSchemaDefinition(Warehouse),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(WarehouseSchema)

const WarehouseModel = registerModel('Warehouse', WarehouseSchema)
const WarehouseTools = {}

export { Warehouse, WarehouseSchema, WarehouseModel, WarehouseTools }
