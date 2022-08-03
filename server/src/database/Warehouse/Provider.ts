import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema } from 'mongoose'

/**
 * Nhà cung cấp hàng hóa
 */

class Provider {
  @field({
    type: String,
    required: true,
  })
  name: string

  @field(String)
  code: string

  @field(String)
  phone: string

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

  @field(String)
  description: string

  @field({ type: Array, of: String, default: [] })
  tags: string[]

  @field({ type: Boolean, default: true })
  is_active: boolean

  createdAt?: Date
  updatedAt?: Date
}

const ProviderSchema = new Schema<Provider>(
  {
    ...getSchemaDefinition(Provider),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(ProviderSchema)

const ProviderModel = registerModel<Provider>('Provider', ProviderSchema)
const ProviderTools = { model: ProviderModel }

export { Provider, ProviderSchema, ProviderModel, ProviderTools }
