import shortid from 'shortid'

export const uniqueId = () => shortid()


export const getMongoId = (value) => {
  if (typeof value === 'string') return value
  if (value._id || value.id) return value._id || value.id
}


