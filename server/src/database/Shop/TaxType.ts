import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema } from 'mongoose'

class TaxType {
  @field({ type: String, required: true })
  name: string

  @field({ type: Number, required: true, default: 0 })
  rate: number

  @field({ type: String })
  code: string

  @field({ type: Boolean, default: true })
  modifiable: boolean

  createdAt?: Date
  updatedAt?: Date
}

const TaxTypeSchema = new Schema<TaxType>(
  {
    ...getSchemaDefinition(TaxType),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(TaxTypeSchema)

const TaxTypeModel = registerModel<TaxType>('TaxType', TaxTypeSchema)
const TaxTypeTools = { model: TaxTypeModel }

export { TaxType, TaxTypeSchema, TaxTypeModel, TaxTypeTools }
