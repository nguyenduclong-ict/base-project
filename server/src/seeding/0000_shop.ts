import { ShopModel } from '@/database'
import { getJsonResource } from '@/helpers'

export default async function () {
  const seedingJson = await getJsonResource('seeding.json')
  await ShopModel.create(seedingJson.shops)
}

export const dropCollections = ['shops']
