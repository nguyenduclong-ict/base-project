import permissions from './permission.json'

export const Constants = {
  ProductAttributes: [
    {
      code: 'color',
      name: 'Màu sắc',
    },
    {
      code: 'size',
      name: 'Size',
    },
  ],
  Permissions: Object.keys(permissions).reduce((ps, key) => {
    return {
      ...ps,
      [key]: key.toLowerCase(),
    }
  }, {} as { [k in keyof typeof permissions]: string }),
}

export const Colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']
