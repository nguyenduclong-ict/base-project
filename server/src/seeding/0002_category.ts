import { CategoryModel } from '@/db'

export default async function () {
  const [dienthoai, laptop] = await CategoryModel.create([
    {
      name: 'Điện thoại',
      slug: 'phone',
    },
    {
      name: 'Laptop',
      slug: 'laptop',
    },
  ])

  await CategoryModel.create([
    {
      name: 'Iphone',
      parent: dienthoai.id,
      slug: 'iphone',
    },
    {
      name: 'Samsung',
      parent: dienthoai.id,
      slug: 'samsung',
    },
  ])

  await CategoryModel.create([
    {
      name: 'Dell',
      parent: laptop.id,
      slug: 'dell',
    },
    {
      name: 'Macbook',
      parent: laptop.id,
      slug: 'macbook',
    },
  ])
}
