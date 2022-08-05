import { connection } from '@/config'
import {
  addTransformIdForSchema,
  field,
  getSchemaDefinition,
  registerModel,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Shop } from './Shop'

export enum AutoIncreaseType {
  SHOP_CODE = 'SHOP_CODE',
  PRODUCT_SKU = 'PRODUCT_SKU',
  WAREHOUSE_CODE = 'WAREHOUSE_CODE',
}

class AutoIncrease {
  @field({
    type: Number,
    enum: Object.values(AutoIncreaseType),
    required: true,
  })
  type: AutoIncreaseType

  @field({ type: Number, required: true, default: -1 })
  index: number

  @field({ type: SchemaTypes.ObjectId, ref: 'Shop' })
  shop?: Shop

  createdAt?: Date
  updatedAt?: Date
}

const AutoIncreaseSchema = new Schema<AutoIncrease>(
  {
    ...getSchemaDefinition(AutoIncrease),
  },
  { timestamps: true, autoIndex: true }
)

AutoIncreaseSchema.index({ type: 1, shop: 1 })

addTransformIdForSchema(AutoIncreaseSchema)

const AutoIncreaseModel = registerModel<AutoIncrease>(
  'AutoIncrease',
  AutoIncreaseSchema
)
const AutoIncreaseTools = {
  model: AutoIncreaseModel,

  async getNextIndex(type: string, shop: any) {
    let nextIndex = 0
    const session = await connection.startSession()
    await session.startTransaction()
    try {
      let currentIndex = await this.model.findOne(
        {
          type,
          shop: shop || null,
        },
        null,
        { session }
      )

      if (!currentIndex) {
        currentIndex = await this.model
          .create([{ type, shop: shop || null, index: 0 }], { session })
          .then((docs) => docs[0])
      }

      nextIndex = currentIndex.index + 1

      await this.model.updateOne(
        { id: currentIndex.id },
        { $inc: { index: 1 } },
        { session }
      )
    } catch (error) {
      await session.abortTransaction()
      await session.endSession()
    } finally {
      await session.endSession()
    }

    return nextIndex
  },

  /**
   *
   * @param prefix
   * @param type
   * @param idMinLength auto add  000 to id, example current index = 1 and idMinLength = 4 => generate id = 0001
   * @param shop
   */
  async generateCode(
    prefix: string,
    type: AutoIncreaseType,
    idMinLength = 4,
    shop: any
  ): Promise<string> {
    let code = prefix || ''
    const index = await this.getNextIndex(type, shop)

    code = code + this.leadingNumber(index, idMinLength)

    return code
  },

  leadingNumber(value: number, minLength = 0) {
    let zeroPrefix = ''
    for (let i = 0; i < minLength - value.toString().length; i++) {
      zeroPrefix += '0'
    }
    return zeroPrefix + value
  },
}

export {
  AutoIncrease,
  AutoIncreaseSchema,
  AutoIncreaseModel,
  AutoIncreaseTools,
}
