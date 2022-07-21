import { connection, waitForConnectionReady } from '@/config'
import { RoleModel } from '@/database'
import consola from 'consola'
import globby from 'globby'
import path from 'path'
import fs from 'fs'

async function seeding() {
  // check seeing file exists
  if (!fs.existsSync(path.join(process.cwd(), 'resources/seeding.json'))) {
    consola.error('please create "resources/seeding.json" file')
    process.exit(1)
  }

  try {
    // drop all collection
    consola.success(`start seeding`)
    await waitForConnectionReady()

    // run seeding
    const paths = await globby(['*', '!index.ts', '!seeding_run.ts'], {
      cwd: __dirname,
      onlyFiles: true,
    })

    for (const filePath of paths) {
      const module = require(path.join(__dirname, filePath))

      // drop collections
      if (module.dropCollections && module.dropCollections.length > 0) {
        for (const c of module.dropCollections) {
          const collections = RoleModel.db.collections
          const collection = collections[c]
          if (collection) {
            try {
              await collection.drop().catch((e) => null)
              await collection.dropIndexes().catch((e) => null)
              consola.success(`drop collection: ${c}`)
            } catch (error) {
              consola.error(`error when drop collection ${c}`, error)
            }
          }
        }
      }

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
