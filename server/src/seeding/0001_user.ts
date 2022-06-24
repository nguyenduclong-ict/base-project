import { ENV } from '@/config'
import { RoleModel, UserModel } from '@/db'
import { hashPassword } from '@/helpers/scrypt'
import seedingJson from '@/resources/seeding.json'

export default async function () {
  await RoleModel.create(seedingJson.roles)

  const adminPasswordHashed = await hashPassword(
    process.env.ADMIN_PASSWORD || 'a12345678X'
  )

  await UserModel.create(
    seedingJson.users.map((user) => ({
      ...user,
      password: user.password || adminPasswordHashed,
    }))
  )
}
