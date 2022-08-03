import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Shop } from '../Shop/Shop'
import { Product } from './Product/Product'
import { Warehouse } from './Warehouse'

/** Collection lưu lại lịch sửa tồn kho theo thời gian */
/** Cần cronjob chạy mỗi này để lưu lại tồn kho theo ngày */

class Inventory {
  @field({ type: SchemaTypes.ObjectId, ref: 'Product' })
  product: Product

  @field({ type: SchemaTypes.ObjectId, ref: 'Warehouse' })
  warehouse: Warehouse

  // Số lượng tồn kho tại thời điểm date
  @field({ type: Number })
  quantity: number

  @field({ type: Date })
  date: Date

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  shop: Shop

  createdAt?: Date | undefined
  updatedAt?: Date | undefined
}

const InventorySchema = new Schema<Inventory>(
  {
    ...getSchemaDefinition(Inventory),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(InventorySchema)

const InventoryModel = registerModel('Inventory', InventorySchema)
const InventoryTools = {}

export { Inventory, InventorySchema, InventoryModel, InventoryTools }
