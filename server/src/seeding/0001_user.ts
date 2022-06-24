import { RoleModel, UserModel } from '@/db'
import { hashPassword } from '@/helpers/scrypt'
import seedingJson from '@/resources/seeding.json'

export default async function () {
  const roles = await RoleModel.create(seedingJson.roles)
  const adminRole = roles.find((role) => role.uid === 'admin')

  const [] = await UserModel.create([
    {
      name: 'Admin',
      username: 'admin',
      password: await hashPassword(process.env.ADMIN_PASSWORD),
      is_active: true,
      is_admin: true,
      type: 'admin',
      roles: [adminRole.id],
    },
  ])
}
