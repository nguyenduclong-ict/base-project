import { ShopModel } from '@/db'
import seedingJson from '@/resources/seeding.json'

export default async function () {
  await ShopModel.create(seedingJson.shops)
}
