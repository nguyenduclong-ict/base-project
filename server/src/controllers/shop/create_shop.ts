import { connection } from '@/config'
import {
  AutoIncreaseTools,
  AutoIncreaseType,
  RoleModel,
  Shop,
  ShopModel,
  TaxModel,
  User,
  UserModel,
  WarehouseModel,
} from '@/database'
import { ShopSettingModel, ShopSettingType } from '@/database/Shop/ShopSetting'
import { createSlug, objectId } from '@/helpers'
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
          created_by: objectId(req.user.id),
          image_url: req.body.image_url,
          color: req.body.color,
          address: req.body.address,
          country_code: req.body.country_code,
          province_code: req.body.province_code,
          district_code: req.body.district_code,
          ward_code: req.body.ward_code,
        },
      ],
      { session }
    )

    await Promise.all([
      initAdminRoleForShop(req.user, shop, session),
      initDefaultWarehouse(shop, session),
      initShopSettings(shop, session),
      initShopData(shop, req.user, session),
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

async function initAdminRoleForShop(user: User, shop: Shop, session: any) {
  let adminRole = user.roles.find((role) => role.full_permission)

  if (!adminRole) {
    adminRole = await RoleModel.create(
      [
        {
          created_by: objectId(user),
          is_default: false,
          name: 'Admin của shop ' + shop.name,
          full_permission: true,
          uid: createSlug(shop.code + '-admin'),
          shops: [objectId(shop)],
        },
      ],
      { session }
    ).then((docs) => docs[0])
    await UserModel.updateOne(
      {
        _id: objectId(user),
      },
      {
        $push: {
          roles: objectId(adminRole),
        },
      }
    )
  } else {
    await RoleModel.updateOne(
      {
        _id: objectId(adminRole),
      },
      {
        $push: {
          shops: objectId(shop),
        },
      },
      {
        session,
      }
    )
  }

  return adminRole
}

async function initShopSettings(shop: Shop, session: any) {
  const [tax] = await TaxModel.create(
    [{ code: '10', rate: 10, name: 'Thuế 10%', modifiable: false }],
    { session }
  )

  const settings = await ShopSettingModel.create([
    {
      type: ShopSettingType.TAX,
      shop: objectId(shop),
      is_default: true,
      value: {
        default_sale_tax: objectId(tax),
        default_import_tax: objectId(tax),
        price_include_tax: true,
      },
    },
  ])

  return settings
}

async function initDefaultWarehouse(shop: Shop, session: any) {
  const [defaultWarehouse] = await WarehouseModel.create(
    [
      {
        country_code: shop.country_code || 'VN',
        province_code: shop.province_code,
        district_code: shop.district_code,
        ward_code: shop.ward_code,
        address: shop.address,
        name: 'Kho mặc định',
        code: await AutoIncreaseTools.generateCode(
          'CN',
          AutoIncreaseType.WAREHOUSE_CODE,
          1,
          objectId(shop)
        ),
      },
    ],
    { session }
  )

  return defaultWarehouse
}

async function initShopData(shop: Shop, user: User, session: any) {}

export const createShopController = [
  createValidate(BodyCreateShop, 'body'),
  _createShopController,
]
