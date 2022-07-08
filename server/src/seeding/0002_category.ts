import { CategoryModel } from '@/db'
import { getJsonResource } from '@/helpers'
import { omit } from 'lodash'

export default async function () {
  const seedingJson = await getJsonResource('seeding.json')
  for (const category of seedingJson.categories) {
    await CategoryModel.create(
      omit(category, 'children'),
      ...category.children.map((child: any) => ({
        ...child,
        parent: category._id,
      }))
    )
  }
}
