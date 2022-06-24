import { CategoryModel } from '@/db'
import seedingJson from '@/resources/seeding.json'
import { omit } from 'lodash'

export default async function () {
  for (const category of seedingJson.categories) {
    await CategoryModel.create(
      omit(category, 'children'),
      ...category.children.map((child) => ({ ...child, parent: category._id }))
    )
  }
}
