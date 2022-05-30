import slugify from 'slugify'

export function createSlug(text: string) {
  return slugify(text, {
    locale: 'vi',
    lower: true,
  })
}
