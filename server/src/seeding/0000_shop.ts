import { ShopModel } from '@/db'
import { getJsonResource } from '@/helpers'

export default async function () {
  const seedingJson = await getJsonResource('seeding.json')
  await ShopModel.create(seedingJson.shops)
}
