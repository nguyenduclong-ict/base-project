import { connection, waitForConnectionReady } from '@/config'
import { RoleModel } from '@/db'
import consola from 'consola'
import globby from 'globby'
import path from 'path'

async function seeding() {
  // drop all collection
  consola.success(`start seeding`)
  await waitForConnectionReady()

  const collections = RoleModel.db.collections

  for (const key in collections) {
    const collection = collections[key]
    try {
      await collection.drop()
      consola.success(`drop collection: ${key}`)
    } catch (error) {}
  }

  // run seeding
  const paths = await globby(['*', '!index.ts', '!seeding_run.ts'], {
    cwd: __dirname,
    onlyFiles: true,
  })
  for (const filePath of paths) {
    const seedingFunc = require(path.join(__dirname, filePath)).default
    if (seedingFunc) await seedingFunc(connection)
    consola.success(`seeding: ${filePath}`)
  }

  consola.success(`seeding success`)
  process.exit()
}

export { seeding }
