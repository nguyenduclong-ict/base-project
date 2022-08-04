import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'

class Log {
  @field({ type: String })
  message: string

  @field({ type: String })
  type: string

  @field({ type: SchemaTypes.Mixed, default: null })
  data: any

  createdAt?: Date
  updatedAt?: Date
}

const LogSchema = new Schema<Log>(
  {
    ...getSchemaDefinition(Log),
  },
  { timestamps: true, autoIndex: true }
)

addTransformIdForSchema(LogSchema)

const LogModel = registerModel<Log>('Log', LogSchema)
const LogTools = { model: LogModel }

export { Log, LogSchema, LogModel, LogTools }
