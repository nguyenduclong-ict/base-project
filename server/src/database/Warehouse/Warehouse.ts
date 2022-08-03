import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Shop } from '../Shop/Shop'

/** Collection lưu trữ các kho hàng */

class Warehouse {
  @field({ type: String, required: true })
  name: string

  @field({ type: String })
  code: string

  @field({ type: String })
  description: string

  // address
  @field(String)
  address: string

  @field(String)
  address2: string

  @field(String)
  country_code: string

  @field(String)
  province_code: string

  @field(String)
  district_code: string

  @field(String)
  ward_code: string
  // end address

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
