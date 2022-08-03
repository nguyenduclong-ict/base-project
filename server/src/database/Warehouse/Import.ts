import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Shop } from '../Shop/Shop'
import { User } from '../User'
import { Product } from './Product/Product'
import { Warehouse } from './Warehouse'

class ImportItem {
  /** Sản phẩm nhập */
  @field({ type: SchemaTypes.ObjectId, ref: 'Product' })
  product: Product

  /** Kho hàng */
  @field({ type: SchemaTypes.ObjectId, ref: 'Warehouse' })
  warehouse: Warehouse

  /** Số lượng nhập */
  @field({ type: Number, required: true, min: 1 })
  quantity: number

  /** Giá nhập hàng */
  @field({ type: Number, required: true, min: 0 })
  price: number
}

const ImportItemSchema = new Schema<ImportItem>(
  getSchemaDefinition(ImportItem),
  { timestamps: true }
)
addTransformIdForSchema(ImportItemSchema)

/** Lịch sử trạng thái của phiếu nhập */
class ImportHistory {
  /**
   * Trạng thái hiện tại của phiếu nhập
   * 0: Mới tạo
   * 1: Chờ duyệt
   * 2: Đã hoàn thành
   * 3: Hủy
   */
  @field({ type: Number, enum: [0, 1, 2, 3], default: 0, required: true })
  status: 0 | 1 | 2 | 3

  @field({ type: SchemaTypes.ObjectId, ref: 'User' })
  created_by: User // Người thự hiện trạng thái này

  @field({ type: String })
  reason: string

  createdAt?: Date | undefined
  updatedAt?: Date | undefined
}

const ImportHistorySchema = new Schema<ImportItem>(
  getSchemaDefinition(ImportHistory),
  {
    timestamps: true,
  }
)
addTransformIdForSchema(ImportHistorySchema)

/** Phiếu nhập hàng */
class Import {
  @field({ type: SchemaTypes.ObjectId, ref: 'Warehouse' })
  warehouse: Warehouse

  @field({ type: [ImportItemSchema], default: [] })
  items: ImportItem[]

  @field({ type: [ImportHistorySchema], default: [] })
  histories: ImportHistory[]

  @field({ type: Date, required: true })
  date: Date

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  shop: Shop

  /**
   * Trạng thái hiện tại của phiếu nhập
   * 0: Mới tạo
   * 1: Chờ duyệt
   * 2: Đã hoàn thành
   * 3: Hủy
   */
  @field({ type: Number, enum: [0, 1, 2, 3], default: 0, required: true })
  status: 0 | 1 | 2 | 3

  @field({ type: SchemaTypes.ObjectId, ref: 'User' })
  created_by: User

  createdAt?: Date | undefined
  updatedAt?: Date | undefined
}

const ImportSchema = new Schema<Import>(
  {
    ...getSchemaDefinition(Import),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(ImportSchema)

const ImportModel = registerModel('Import', ImportSchema)
const ImportTools = {}

export { Import, ImportSchema, ImportModel, ImportTools }
