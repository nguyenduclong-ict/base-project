import { createSlug } from '@/helpers'
import {
  addTransformIdForSchema,
  getSchemaDefinition,
  registerModel,
  field,
} from '@/helpers/mongo'
import { IsArray, IsString } from 'class-validator'
import { Schema, SchemaTypes } from 'mongoose'
import shortid from 'shortid'
import { Shop } from '../Shop'

/** ProductAttribute */
export class ProductAttribute {
  @field(String)
  @IsString()
  name: string

  @field(String)
  @IsString()
  code: string

  @field({ type: SchemaTypes.Mixed, default: [] })
  @IsArray()
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

  @field({ type: Array, of: String })
  images: string[]

  @field({ type: [ProductAttributeSchema], default: [] })
  attributes: ProductAttribute[]

  variants?: Product[]

  // product is variant
  @field({ type: Boolean, default: false })
  is_variant?: boolean

  @field({ type: [ProductVariantValueSchema], default: [] })
  variant_values?: ProductVariantValue[]

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

  @field({ type: Number, default: 0 })
  avg_price: Number // Giá vốn, tính theo công thức bình quân gia quyền

  @field({ type: Array, of: Number, default: [] })
  avg_price_histories: Number[] // Giá vốn, tính theo công thức bình quân gia quyền

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  shop: Shop

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

  generateProductVariantName(
    parentName: string,
    variantValues: ProductVariantValue[]
  ) {
    return (
      parentName +
      ' ' +
      variantValues.map((item) => item.attribute_value).join(', ')
    )
  },

  generateProductVariantSlug(
    parentSlug: string,
    variantValues: ProductVariantValue[]
  ) {
    return createSlug(
      parentSlug +
        '-' +
        variantValues.map((item) => item.attribute_value).join('-')
    )
  },
}

export function validateVariants(product: Product) {
  for (const item of product.variants) {
    if (item.variant_values.length === 0) {
      throw new Error(`Variant values must at least 1 item`)
    }

    item.variant_values.forEach((value) => {
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
