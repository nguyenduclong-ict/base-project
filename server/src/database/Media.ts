import { ENV } from '@/config'
import urlJoin from '@/helpers/lib/url-join'
import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { model, Schema, SchemaTypes } from 'mongoose'
import { Shop } from './Shop'
import { User } from './User'

export class MediaThumbnail {
  @field(String)
  dimension: string

  @field(String)
  s3_key: string

  url?: string
}

class Media {
  @field(String)
  name: string // orignal name

  @field({ type: String })
  mimetype: string

  /** fileSize */
  @field({ type: Number })
  size: number

  @field({ type: String })
  s3_key: string

  @field({ type: SchemaTypes.ObjectId, ref: 'User' })
  user?: User

  /** Image dimension */
  @field({ type: String, default: null })
  dimension?: string

  @field({
    type: SchemaTypes.Mixed,
    default: [],
  })
  thumbnails: MediaThumbnail[]

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  shop?: Shop

  url?: string

  createdAt?: Date
  updatedAt?: Date
}

const MediaSchema = new Schema<Media>(
  {
    ...getSchemaDefinition(Media),
  },
  { timestamps: true, autoIndex: true }
)

MediaSchema.virtual('url').get(function (this) {
  return urlJoin(ENV.API_URL, 'media', this.s3_key)
})

addTransformIdForSchema(MediaSchema)

MediaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) {
    delete ret._id
    if (doc.thumbnails) {
      ret.thumbnails = doc.thumbnails.map((thum: any) => {
        return {
          ...thum,
          url: urlJoin(ENV.API_URL, 'media', thum.s3_key),
        }
      })
    }
  },
})

const MediaModel = registerModel('Media', MediaSchema)
const MediaTools = { model: MediaModel }

export { Media, MediaSchema, MediaModel, MediaTools }
