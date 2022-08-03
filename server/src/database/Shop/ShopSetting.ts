import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Shop } from './Shop'

export enum ShopSettingType {
  TAX = 'TAX',
}

export interface TaxSetting {
  default_sale_tax: any
  default_import_tax: any
  use_tax: boolean // giá nhập, giá bán có bao gồm thuế hay không, khi tính giá vốn, sử dụng khi tính giá vống
}

class ShopSetting {
  @field({ type: SchemaTypes.Mixed })
  value: TaxSetting

  @field({ type: String, enum: Object.values(ShopSettingType) })
  type: ShopSettingType

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop', required: true })
  shop: Shop

  @field({ type: Boolean, default: false })
  is_default?: boolean

  createdAt?: Date
  updatedAt?: Date
}

const ShopSettingSchema = new Schema<ShopSetting>(
  {
    ...getSchemaDefinition(ShopSetting),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(ShopSettingSchema)

const ShopSettingModel = registerModel<ShopSetting>(
  'ShopSetting',
  ShopSettingSchema
)
const ShopSettingTools = { model: ShopSettingModel }

export { ShopSetting, ShopSettingSchema, ShopSettingModel, ShopSettingTools }
