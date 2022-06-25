import {
  addTransformIdForSchema,
  getSchemaDefinition,
  registerModel,
  field,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Role } from './Role'
import { Shop, ShopModel } from './Shop'

class User {
  _id?: any
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

UserSchema.virtual('shops').get(function () {
  const shopsMap: any = {}
  this.roles.forEach((role) => {
    if (role.shop?.id && !shopsMap[role.shop.id]) {
      shopsMap[role.shop?.id] = role.shop
    }
  })
  return Object.values(shopsMap)
})

const UserModel = registerModel('User', UserSchema)
const UserTools = {
  model: UserModel,
  omitPassword(user: User) {
    user.password = null
    return user
  },
}

export { User, UserSchema, UserModel, UserTools }
