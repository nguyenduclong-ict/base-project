import { ProductAttribute, ProductModel, validateProduct } from '@/db'
import { createSlug } from '@/helpers'
import { createValidate } from '@/helpers/validator'
import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
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
  const isProductHasVariant =
    req.body.has_variants &&
    req.body.attributes.length > 0 &&
    req.body.variants.length > 0

  if (isProductHasVariant) {
    // create product with variants
  } else {
    req.body.slug = createSlug(req.body.name)
    const existed = await ProductModel.findOne({ slug: req.body.slug })

    if (existed) {
      return req.sendError({
        code: 422,
        type: 'PRODUCT_EXISTED',
        message: `slug ${req.body.slug} is existed`,
      })
    }

    // create single product
    const product = await ProductModel.create({
      image: req.body.image,
      images: req.body.images,
      description: req.body.description,
      shop: req.body.shop,
      slug: req.body.slug,
      price: req.body.price,
      sale_off_price: req.body.sale_off_price,
    })

    res.json(product)
  }
}

export const createProductController = [
  createValidate(BodyCreateProduct, 'body'),
  handler,
]
