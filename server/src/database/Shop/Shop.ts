import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { User } from '../User'

class Shop {
  // _id?: any
  id?: any

  @field({ type: String, index: 'text', required: true })
  name: string

  @field({ type: String, unique: true, required: true })
  code: string

  @field({ type: String })
  image_url: string

  @field({ type: String })
  color: string

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

  @field({ type: SchemaTypes.ObjectId, ref: 'User' })
  created_by?: User

  createdAt?: Date
  updatedAt?: Date
}

const ShopSchema = new Schema<Shop>(
  {
    ...getSchemaDefinition(Shop),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(ShopSchema)

const ShopModel = registerModel('Shop', ShopSchema)
const ShopTools = { model: ShopModel }

export { Shop, ShopSchema, ShopModel, ShopTools }
