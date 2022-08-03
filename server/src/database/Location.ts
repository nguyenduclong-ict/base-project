import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema } from 'mongoose'

class Location {
  @field({ type: String, index: 'text' })
  name: string

  @field({ type: Number })
  province_id: number

  @field({ type: String })
  province_code: string

  @field({ type: Number })
  district_id: number

  @field({ type: String })
  district_code: string

  @field({ type: String })
  ward_code: string

  @field({ type: String, enum: ['province', 'district', 'ward'] })
  type: 'province' | 'district' | 'ward'

  createdAt?: Date
  updatedAt?: Date
}

const LocationSchema = new Schema<Location>(
  {
    ...getSchemaDefinition(Location),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(LocationSchema)

const LocationModel = registerModel<Location>('Location', LocationSchema)
const LocationTools = { model: LocationModel }

export { Location, LocationSchema, LocationModel, LocationTools }
