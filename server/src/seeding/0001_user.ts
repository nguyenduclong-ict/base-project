import { RoleModel, UserModel } from '@/db'
import { getJsonResource } from '@/helpers'
import { hashPassword } from '@/helpers/scrypt'

export default async function () {
  const seedingJson = await getJsonResource('seeding.json')
  await RoleModel.create(seedingJson.roles)

  const adminPasswordHashed = await hashPassword(
    process.env.ADMIN_PASSWORD || 'a12345678X'
  )

  await UserModel.create(
    seedingJson.users.map((user: any) => ({
      ...user,
      password: user.password || adminPasswordHashed,
    }))
  )
}
