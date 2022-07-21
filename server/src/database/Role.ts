import { Constants } from '@/config/constants'
import {
  addTransformIdForSchema,
  getSchemaDefinition,
  registerModel,
  field,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Shop } from './Shop'

class Role {
  @field(String)
  name: string

  @field({ type: String, unique: true })
  uid: string

  @field({
    type: [String],
    default: [],
    enum: Object.keys(Constants.Permissions),
  })
  permissions: string[]

  @field({ type: Boolean, default: false })
  full_permission: boolean

  @field({ type: Boolean, default: false })
  is_default: boolean

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  shop: Shop

  createdAt?: Date
  updatedAt?: Date
}

const RoleSchema = new Schema<Role>(
  {
    ...getSchemaDefinition(Role),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(RoleSchema)

const RoleModel = registerModel('Role', RoleSchema)
const RoleTools = { model: RoleModel }

export { Role, RoleSchema, RoleModel, RoleTools }
