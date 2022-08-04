import shortid from 'shortid'

export const uniqueId = () => shortid()


export const getMongoId = (value) => {
  if (typeof value === 'string') return value
  if (value._id || value.id) return value._id || value.id
}


/**
 *
 * @param {any[][]} arr1
 * @param {any[]} arr2
 * @returns
 */
const combindTwoArray = (arr1 = [], arr2 = []) => {
  const result = []

  arr2.forEach(e => {
    const c = [e]
    arr1.forEach(e1 => {
      result.push([...e1, ...c])
    })
  })

  return result
}


/**
 *
 * @param {any[][]} arr
 */
export const getCombination = (arr = []) => {
  const k = arr.length
  let result = arr[0].map(e => [e])

  for (let i = 1; i < k; i++) {
    const e = arr[i];
    result = combindTwoArray(result, e)
  }

  return result
}
