import { createSlug } from '@/helpers'
import {
  addTransformIdForSchema,
  getSchemaDefinition,
  registerModel,
  field,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'

class Category {
  @field({ type: String, unique: true, required: true })
  slug: string

  @field({ type: String })
  color?: string

  @field({ type: String, required: true })
  name: string

  @field({ type: SchemaTypes.ObjectId, ref: 'Category' })
  parent: Category

  createdAt?: Date | undefined
  updatedAt?: Date | undefined
}

const CategorySchema = new Schema<Category>(
  {
    ...getSchemaDefinition(Category),
  },
  { timestamps: true, autoIndex: true }
)

CategorySchema.virtual('children', {
  localField: '_id',
  foreignField: 'parent',
  ref: 'Category',
})

CategorySchema.pre('save', function () {
  if (!this.slug) this.slug = createSlug(this.name)
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
