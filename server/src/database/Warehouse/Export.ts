import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Product } from './Product'
import { Shop } from '../Shop'
import { Warehouse } from './Warehouse'
import { User } from '../User'

class ExportItem {
  /** Sản phẩm xuất */
  @field({ type: SchemaTypes.ObjectId, ref: 'Product' })
  product: Product

  /** Kho hàng */
  @field({ type: SchemaTypes.ObjectId, ref: 'Warehouse' })
  warehouse: Warehouse

  /** Số lượng xuất */
  @field({ type: Number, required: true, min: 1 })
  quantity: number

  /** Giá xuất hàng */
  @field({ type: Number, required: true, min: 0 })
  price: number
}

const ExportItemSchema = new Schema<ExportItem>(
  getSchemaDefinition(ExportItem),
  { timestamps: true }
)
addTransformIdForSchema(ExportItemSchema)

/** Lịch sử trạng thái của phiếu xuất */
class ExportHistory {
  /**
   * Trạng thái hiện tại của phiếu xuất
   * 0: Mới tạo
   * 1: Chờ duyệt
   * 2: Đã hoàn thành
   * 3: Hủy
   */
  @field({ type: Number, enum: [0, 1, 2, 3], default: 0, required: true })
  status: 0 | 1 | 2 | 3

  @field({ type: SchemaTypes.ObjectId, ref: 'User' })
  created_by: User // Người thực hiện trạng thái này

  @field({ type: String })
  reason: string

  createdAt?: Date | undefined
  updatedAt?: Date | undefined
}

const ExportHistorySchema = new Schema<ExportItem>(
  getSchemaDefinition(ExportHistory),
  {
    timestamps: true,
  }
)
addTransformIdForSchema(ExportHistorySchema)

/** Phiếu nhập hàng */
class Export {
  @field({ type: SchemaTypes.ObjectId, ref: 'Warehouse' })
  warehouse: Warehouse

  @field({ type: [ExportItemSchema], default: [] })
  items: ExportItem[]

  @field({ type: [ExportHistorySchema], default: [] })
  histories: ExportHistory[]

  @field({ type: Date, required: true })
  date: Date

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  shop: Shop

  /**
   * Trạng thái hiện tại của phiếu xuất
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

const ExportSchema = new Schema<Export>(
  {
    ...getSchemaDefinition(Export),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(ExportSchema)

const ExportModel = registerModel('Export', ExportSchema)
const ExportTools = {}

export { Export, ExportSchema, ExportModel, ExportTools }
