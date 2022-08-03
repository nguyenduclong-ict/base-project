import { createSlug } from '@/helpers'
import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import shortid from 'shortid'
import { MediaImage } from '../Media'
import { Shop } from '../Shop'
import { Category } from './Category'
import { ProductAttribute, ProductAttributeSchema } from './ProductAttribute'

/** ProductVariantValue */
class ProductVariantValue {
  @field(String)
  slug: string

  @field(SchemaTypes.Mixed)
  value: string
}

const ProductVariantValueSchema = new Schema<ProductVariantValue>(
  getSchemaDefinition(ProductVariantValue),
  { timestamps: true }
)
addTransformIdForSchema(ProductVariantValueSchema)

class Product {
  @field({ type: String, required: true, index: 'text' })
  name: string

  @field({
    type: String,
    required: true,
    unique: true,
    default: function (this, doc: any) {
      return shortid() + '-' + createSlug(doc.name)
    },
    index: 'text',
  })
  slug: string

  @field(String)
  description: string

  @field({ type: SchemaTypes.Mixed })
  image: MediaImage

  @field({ type: SchemaTypes.Mixed })
  images: MediaImage[]

  @field([{ type: SchemaTypes.ObjectId, ref: 'Category' }])
  categories?: Category[]

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

  /**
   * Giá vốn tính theo công thức bình quân
   * https://www.sapo.vn/blog/gia-von-hang-ban-va-cach-tinh
   */

  @field({ type: Number, default: 0 })
  cost_price: number // Giá vốn, tính theo công thức bình quân

  @field({
    type: SchemaTypes.Mixed,
    default: { ton_kho: 0, gia_tri_kho: 0, date: null },
  })
  cost_price_history: {
    ton_kho: number // Tồn kho của sản phẩm tại thời điểm tính giá vốn
    gia_tri_kho: number // Giá trị kho tại thời điểm tính giá vốn
    date: Date // Thời điểm tính giá vốn
  }

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
    return parentName + ' ' + variantValues.map((item) => item.value).join(', ')
  },

  generateProductVariantSlug(
    parentSlug: string,
    variantValues: ProductVariantValue[]
  ) {
    return createSlug(
      parentSlug + '-' + variantValues.map((item) => item.value).join('-')
    )
  },

  tinhGiaVonSanPham() {},
}

export function validateVariants(product: Product) {
  for (const item of product.variants) {
    if (item.variant_values.length === 0) {
      throw new Error(`Variant values must at least 1 item`)
    }

    item.variant_values.forEach((value) => {
      if (!product.attributes.find((attr) => attr.slug === value.slug)) {
        throw new Error(
          `Variant values 'slug' ${value.slug} not found in product`
        )
      }

      if (
        !product.attributes.find((attr) =>
          attr.values.find((v) => v.slug === value.slug)
        )
      ) {
        throw new Error(
          `Variant values 'slug' ${value.slug} not found in product`
        )
      }
    })
  }

  product.has_variants = product.variants.length > 0
}

export { Product, ProductSchema, ProductModel, ProductTools }
