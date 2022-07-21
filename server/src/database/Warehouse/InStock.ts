import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Shop } from '../Shop'
import { Product } from './Product'
import { Warehouse } from './Warehouse'

/** Collection thể hiện mối quan hệ giữa sản phẩm và kho hàng (Hiện tại có bao nhiêu hàng trong kho) */

class InStock {
  @field({ type: SchemaTypes.ObjectId, ref: 'Product' })
  product: Product

  @field({ type: SchemaTypes.ObjectId, ref: 'Warehouse' })
  warehouse: Warehouse

  // Số lượng hàng tồn kho hiện tại
  @field({ type: Number })
  quantity: number

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  shop: Shop

  createdAt?: Date | undefined
  updatedAt?: Date | undefined
}

const InStockSchema = new Schema<InStock>(
  {
    ...getSchemaDefinition(InStock),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(InStockSchema)

const InStockModel = registerModel('InStock', InStockSchema)
const InStockTools = {}

export { InStock, InStockSchema, InStockModel, InStockTools }
