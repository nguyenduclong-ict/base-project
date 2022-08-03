import { createSlug } from '@/helpers'
import { Product, ProductModel, ProductVariantValue } from './Product'

export const ProductTools = {
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

  /**
   * Cập nhật giá vốn cho sản phẩm theo công thức bình quân
   * @param product
   * @param import_quantity
   * @param import_price
   */
  async updateCostPrice(
    product: Product,
    import_quantity: number,
    import_price: number
  ) {
    const tonkho = 0
  },

  validateVariants(product: Product) {
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
  },
}
