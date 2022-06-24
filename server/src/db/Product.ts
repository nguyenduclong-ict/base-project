import { createSlug } from '@/helpers'
import {
  addTransformIdForSchema,
  getSchemaDefinition,
  registerModel,
  field,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import shortid from 'shortid'

/** ProductAttribute */
class ProductAttribute {
  @field(String)
  name: string

  @field(String)
  code: string

  @field({ type: SchemaTypes.Mixed, default: [] })
  values: any[]
}

const ProductAttributeSchema = new Schema<ProductAttribute>(
  getSchemaDefinition(ProductAttribute),
  { timestamps: true }
)
addTransformIdForSchema(ProductAttributeSchema)

/** ProductVariantValue */
class ProductVariantValue {
  @field(String)
  attribute_code: string

  @field(SchemaTypes.Mixed)
  attribute_value: string
}

const ProductVariantValueSchema = new Schema<ProductVariantValue>(
  getSchemaDefinition(ProductVariantValue),
  { timestamps: true }
)
addTransformIdForSchema(ProductVariantValueSchema)

/** ProductVariant */
class ProductVariant {
  @field(String)
  name: string

  @field(String)
  slug: string

  @field({ type: [ProductVariantValueSchema], default: [], minlength: 1 })
  values: ProductVariantValue[]

  @field({ type: Number, min: 0 })
  price: number

  @field({ type: Number, min: 0 })
  sale_off_price: number
}

const ProductVariantSchema = new Schema<ProductVariant>(
  getSchemaDefinition(ProductVariant),
  { timestamps: true }
)
addTransformIdForSchema(ProductVariantSchema)

class Product {
  @field({ type: String, required: true })
  name: string

  @field({
    type: String,
    required: true,
    unique: true,
    default: function (this, doc: any) {
      return shortid() + '-' + createSlug(doc.name)
    },
  })
  slug: string

  @field(String)
  description: string

  @field(String)
  image: string

  @field(String)
  images: string[]

  @field({ type: [ProductAttributeSchema], default: [] })
  attributes: ProductAttribute[]

  @field({ type: [ProductVariantSchema], default: [] })
  variants: ProductVariant[]

  @field({ type: Boolean, default: false })
  is_variant?: boolean

  @field({ type: SchemaTypes.ObjectId, ref: 'Product' })
  variant_of?: Product

  @field({ type: Boolean, default: false })
  has_variants: boolean

  @field({ type: Number, min: 0 })
  price: number

  @field({ type: Number, min: 0 })
  sale_off_price: number

  @field(Boolean)
  is_sale_off: boolean

  createdAt?: Date
  updatedAt?: Date
}

const ProductSchema = new Schema<Product>(getSchemaDefinition(Product), {
  timestamps: true,
  autoIndex: true,
})
addTransformIdForSchema(ProductSchema)

const ProductModel = registerModel('Product', ProductSchema)
const ProductTools = {
  model: ProductModel,
}

export function validateProduct(product: Product) {
  for (const item of product.variants) {
    if (item.values.length === 0) {
      throw new Error(`Variant values must at least 1 item`)
    }

    item.values.forEach((value) => {
      if (
        !product.attributes.find((attr) => attr.code === value.attribute_code)
      ) {
        throw new Error(
          `Variant values 'attribute_code' ${value.attribute_code} not found in product`
        )
      }

      if (
        !product.attributes.find((attr) =>
          attr.values.includes(value.attribute_value)
        )
      ) {
        throw new Error(
          `Variant values 'attribute_value' ${value.attribute_value} not found in product`
        )
      }
    })
  }

  product.has_variants = product.variants.length > 0
}

export { Product, ProductSchema, ProductModel, ProductTools }
