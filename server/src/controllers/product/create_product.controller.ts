import { connection } from '@/config'
import {
  MediaImage,
  ProductAttribute,
  ProductModel,
  ProductTools,
  validateVariants,
} from '@/database'
import { createSlug } from '@/helpers'
import { createValidate } from '@/helpers/validator'
import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { RequestHandler } from 'express'

class VariantValue {
  @IsString()
  attribute_code: string

  @IsString()
  attribute_value: string
}

class Variant {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => VariantValue)
  values: VariantValue[]

  @IsNumber()
  price: number

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  slug?: string

  @IsObject()
  @IsOptional()
  image?: MediaImage

  @IsObject({ each: true })
  @IsOptional()
  images?: MediaImage[]

  @IsNumber()
  sale_off_price: number
}

class BodyCreateProduct {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  slug: string

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsOptional()
  image: string

  @IsString({ each: true })
  @IsOptional()
  images: string[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttribute)
  @IsOptional()
  attributes: ProductAttribute[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Variant)
  @IsOptional()
  variants: Variant[]

  @IsBoolean()
  @IsOptional()
  has_variants: boolean

  @IsNumber()
  price: number

  @IsNumber()
  sale_off_price: number

  @IsBoolean()
  is_sale_off: boolean

  @IsString()
  shop: string
}

export const handler: RequestHandler<any, any, BodyCreateProduct> = async (
  req,
  res,
  next
) => {
  req.body.slug = createSlug(req.body.name)
  const existed = await ProductModel.findOne({ slug: req.body.slug })

  if (existed) {
    return req.sendError({
      code: 422,
      type: 'PRODUCT_EXISTED',
      message: `slug ${req.body.slug} is existed`,
    })
  }
  const session = await connection.startSession()
  await session.startTransaction()

  try {
    // create parent product
    const [product] = await ProductModel.create(
      [
        {
          image: req.body.image,
          images: req.body.images,
          description: req.body.description,
          attributes: req.body.attributes,
          shop: req.body.shop,
          slug: req.body.slug,
          price: req.body.price,
          sale_off_price: req.body.sale_off_price,
        },
      ],
      { session }
    )

    const isProductHasVariant =
      req.body.has_variants &&
      req.body.attributes.length > 0 &&
      req.body.variants.length > 0

    if (isProductHasVariant) {
      // create product with variants
      try {
        validateVariants(req.body as any)
      } catch (error: any) {
        return req.sendError({
          code: 422,
          message: error.message || error.toString(),
        })
      }

      // create variants
      const variants = await ProductModel.create(
        req.body.variants.map((variant) => {
          return {
            variant_of: product.id,
            image: variant.image,
            is_variant: true,
            variant_values: variant.values,
            shop: req.body.shop,
            slug:
              variant.slug ||
              ProductTools.generateProductVariantSlug(
                req.body.slug,
                variant.values
              ),
            name:
              variant.name ||
              ProductTools.generateProductVariantName(
                req.body.name,
                variant.values
              ),
            price: variant.price,
            sale_off_price: variant.sale_off_price,
          }
        }),
        { session }
      )

      product.variants = variants
    }

    await session.commitTransaction()
    await session.endSession()
    return res.json(product)
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    req.sendError({
      code: 500,
      type: 'CREATE_PRODUCT_ERROR',
      message: error.message || error.toString() || 'Lỗi khi tạo sản phẩm',
    })
  } finally {
    await session.endSession()
  }
}

export const createProductController = [
  createValidate(BodyCreateProduct, 'body'),
  handler,
]
