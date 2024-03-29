import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema, SchemaTypes, Types } from 'mongoose'
import { Role } from './Role'
import { Customer, Shop } from './Shop'

class User {
  _id?: Types.ObjectId
  id?: any

  @field(String)
  username: string

  @field(String)
  password: string

  @field({ type: String, required: true })
  name: string

  @field(String)
  image_url: String

  @field({ type: Boolean, default: false })
  is_admin: boolean

  @field({ type: Boolean, default: false })
  is_active: boolean

  @field({ type: [SchemaTypes.ObjectId], ref: 'Role', default: [] })
  roles?: Role[]

  shops?: Shop[]

  /** Loại tài khoản, quản lý shop hoặc khách hàng
   * admin: Nhân viên shop hoặc admin
   * customer: Khách hàng
   */
  @field({ type: String, enum: ['admin', 'customer'], default: 'admin' })
  type: 'admin' | 'customer'

  @field({
    type: SchemaTypes.ObjectId,
    ref: 'Customer',
  })
  customer: Customer

  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new Schema<User>(
  {
    ...getSchemaDefinition(User),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(UserSchema)

const UserModel = registerModel('User', UserSchema)
const UserTools = {
  model: UserModel,
  omitPassword(user: User) {
    user.password = null
    return user
  },
}

export { User, UserSchema, UserModel, UserTools }
