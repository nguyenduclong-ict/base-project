import { connection } from '@/config'
import {
  Entity,
  EntityTimestamp,
  field,
  getSchemaDefinition,
} from '@/helpers/mongo'
import { Schema } from 'mongoose'

class Product implements Entity, EntityTimestamp {
  _id?: any
  id?: any

  @field(String)
  name: string | undefined

  @field(String)
  description: string | undefined

  createdAt?: Date | undefined
  updatedAt?: Date | undefined
}

const ProductSchema = new Schema<Product>(
  {
    ...getSchemaDefinition(Product),
  },
  { timestamps: true, autoIndex: true }
)

const productModel = connection.model('Product', ProductSchema)

export { Product, ProductSchema, productModel }
