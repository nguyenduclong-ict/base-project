import fs from 'fs/promises'
import path from 'path'
import slugify from 'slugify'

export function createSlug(text: string) {
  return slugify(text, {
    locale: 'vi',
    lower: true,
  })
}

export async function getJsonResource(name: string) {
  const raw = await fs.readFile(path.join(__dirname, '../resources', name))
  return JSON.parse(raw as unknown as string)
}
