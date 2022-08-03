import { connection } from '@/config'
import {
  AutoIncreaseTools,
  AutoIncreaseType,
  ShopModel,
  TaxTypeModel,
  WarehouseModel,
} from '@/database'
import { ShopSettingModel, ShopSettingType } from '@/database/Shop/ShopSetting'
import { createSlug, objectIdToString } from '@/helpers'
import logger from '@/helpers/logger'
import { createValidate } from '@/helpers/validator'
import { IsOptional, IsString } from 'class-validator'
import { RequestHandler } from 'express'

class BodyCreateShop {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  image_url?: string

  @IsString()
  @IsOptional()
  color: string

  @IsString()
  @IsOptional()
  country_code: string

  @IsString()
  @IsOptional()
  province_code: string

  @IsString()
  @IsOptional()
  district_code: string

  @IsString()
  @IsOptional()
  ward_code: string

  @IsString()
  @IsOptional()
  address: string
}

export const _createShopController: RequestHandler<
  any,
  any,
  BodyCreateShop
> = async (req, res, next) => {
  // create unique shopcode
  const orignalCode = createSlug(req.body.name)
  let code
  let i = 0
  let exists

  do {
    code = i ? orignalCode + i : orignalCode
    exists = await ShopModel.findOne({ code })
    i++
  } while (exists)

  const session = await connection.startSession()
  await session.startTransaction()

  try {
    const [shop] = await ShopModel.create(
      [
        {
          name: req.body.name,
          code,
          created_by: objectIdToString(req.user.id),
          image_url: req.body.image_url,
          color: req.body.color,
        },
      ],
      { session }
    )

    // init default warehouse
    const [defaultWarehouse] = await WarehouseModel.create(
      [
        {
          country_code: req.body.country_code || 'VN',
          province_code: req.body.province_code,
          district_code: req.body.district_code,
          ward_code: req.body.ward_code,
          address: req.body.address,
          name: 'Kho mặc định',
          code: await AutoIncreaseTools.generateCode(
            'CN',
            AutoIncreaseType.WAREHOUSE_CODE,
            1,
            objectIdToString(shop)
          ),
        },
      ],
      { session }
    )

    const [taxType] = await TaxTypeModel.create(
      [{ code: '10', rate: 10, name: 'Thuế 10%', modifiable: false }],
      { session }
    )

    // settings

    ShopSettingModel.create([
      {
        type: ShopSettingType.TAX,
        shop: objectIdToString(shop),
        is_default: true,
        value: {
          default_sale_tax: objectIdToString(taxType),
          default_import_tax: objectIdToString(taxType),
          use_tax: true,
        },
      },
    ])

    await session.commitTransaction()
    await session.endSession()
    res.json(shop)
  } catch (error: any) {
    logger.error('create shop error', error)
    await session.abortTransaction()
    await session.endSession()
    req.sendError({
      code: 500,
      type: 'CREATE_SHOP_ERROR',
      message: error.message || error.toString() || 'Lỗi tạo shop',
    })
  } finally {
    await session.endSession()
  }
}

export const createShopController = [
  createValidate(BodyCreateShop, 'body'),
  _createShopController,
]
