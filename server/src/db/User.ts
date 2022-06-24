import {
  addTransformIdForSchema,
  getSchemaDefinition,
  registerModel,
  field,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Role } from './Role'
import { Shop } from './Shop'

class User {
  _id?: any
  id?: any

  @field(String)
  username: string

  @field(String)
  password: string

  @field(String)
  name: string

  @field({ type: String, enum: ['admin', 'customer'], default: 'user' })
  type: 'admin' | 'customer'

  @field({ type: Boolean, default: false })
  is_admin: boolean

  @field({ type: Boolean, default: false })
  is_active: boolean

  @field({ type: [SchemaTypes.ObjectId], ref: 'Role' })
  roles: Role[]

  @field({ type: [SchemaTypes.ObjectId], ref: 'Shop' })
  shops: Shop[]

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
