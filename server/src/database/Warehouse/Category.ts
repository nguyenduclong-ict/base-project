import { Colors } from '@/config/constants'
import { createSlug } from '@/helpers'
import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { sample } from 'lodash'
import { Schema, SchemaTypes } from 'mongoose'
import { Shop } from '../Shop/Shop'

class Category {
  @field({ type: String, required: true })
  slug: string

  @field({ type: String })
  color?: string

  @field({ type: String, required: true, index: 'text' })
  name: string

  @field({ type: SchemaTypes.ObjectId, ref: 'Category' })
  parent: Category

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  shop: Shop

  createdAt?: Date | undefined
  updatedAt?: Date | undefined
}

const CategorySchema = new Schema<Category>(
  {
    ...getSchemaDefinition(Category),
  },
  { timestamps: true, autoIndex: true }
)

CategorySchema.index({ shop: 1, slug: 1 })

CategorySchema.virtual('children', {
  localField: '_id',
  foreignField: 'parent',
  ref: 'Category',
})

CategorySchema.pre('save', function () {
  if (!this.slug) this.slug = createSlug(this.name)
  if (!this.color) this.color = sample(Colors)
})

CategorySchema.pre('insertMany', function (next: any, docs: any[]) {
  docs.forEach((doc: Category) => {
    if (!doc.slug) doc.slug = createSlug(doc.name)
  })
  next()
})

addTransformIdForSchema(CategorySchema)

const CategoryModel = registerModel('Category', CategorySchema)
const CategoryTools = {}

export { Category, CategorySchema, CategoryModel, CategoryTools }
