import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema } from 'mongoose'

class Tax {
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

const TaxSchema = new Schema<Tax>(
  {
    ...getSchemaDefinition(Tax),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(TaxSchema)

const TaxModel = registerModel<Tax>('Tax', TaxSchema)
const TaxTools = { model: TaxModel }

export { Tax, TaxSchema, TaxModel, TaxTools }
