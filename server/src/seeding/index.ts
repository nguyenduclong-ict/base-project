import { connection, waitForConnectionReady } from '@/config'
import { RoleModel } from '@/db'
import consola from 'consola'
import globby from 'globby'
import path from 'path'
import fs from 'fs'

async function seeding() {
  // check seeing file exists

  if (!fs.existsSync(path.join(__dirname, '../resources/seeding.json'))) {
    consola.error('please create "src/resources/seeding.json" file')
    process.exit(1)
  }

  try {
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
  } catch (error) {
    consola.error(error)
    process.exit(1)
  }
}

export { seeding }
