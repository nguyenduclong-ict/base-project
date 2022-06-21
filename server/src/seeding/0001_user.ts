import { RoleModel, UserModel } from '@/db'
import { hashPassword } from '@/helpers/scrypt'

export default async function () {
  const [adminRole, staffRole, customerRole] = await RoleModel.create([
    {
      name: 'Admin',
      uid: 'admin',
      is_default: true,
      permissions: [],
      full_permission: true,
      type: 'admin',
    },
    {
      name: 'Staff',
      uid: 'staff',
      is_default: true,
      permissions: [],
      type: 'admin',
    },
    {
      name: 'Customer',
      uid: 'customer',
      is_default: true,
      permissions: [],
      type: 'customer',
    },
  ])

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
