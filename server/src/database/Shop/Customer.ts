import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { isPhoneNumber } from 'class-validator'
import { Schema } from 'mongoose'

class Customer {
  @field({ type: String, required: true })
  name: string

  @field({
    type: String,
    enum: ['web', 'facebook', 'wholesale', 'retail'], // khách hàng từ web, facebook, khách buôn, khách lẻ
    required: true,
  })
  type: 'web' | 'facebook' | 'wholesale' | 'retail'

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

  @field({ type: String, validate: isPhoneNumber })
  phone: string

  @field({ type: String })
  description: string

  @field({ type: Array, of: String, default: [] })
  tags: string[]

  @field({ type: String })
  facebook_id: string

  /** Tổng chi tiêu */
  @field({ type: Number, default: 0 })
  total_spending: number

  /** Tổng số đơn hàng */
  @field({ type: Number, default: 0 })
  total_orders: number

  /** Công nợ (Số tiền khách nợ) */
  @field({ type: Number, default: 0 })
  debt: number

  createdAt?: Date
  updatedAt?: Date
}

const CustomerSchema = new Schema<Customer>(
  {
    ...getSchemaDefinition(Customer),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(CustomerSchema)

const CustomerModel = registerModel<Customer>('Customer', CustomerSchema)
const CustomerTools = { model: CustomerModel }

export { Customer, CustomerSchema, CustomerModel, CustomerTools }
