import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema } from 'mongoose'

class Shop {
  @field(String)
  name: string

  @field({ type: String, unique: true, required: true })
  code: string

  @field({ type: String })
  image_url: string

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
