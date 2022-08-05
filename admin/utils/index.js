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
  if (k === 0) return []
  let result = arr[0].map(e => [e])

  for (let i = 1; i < k; i++) {
    const e = arr[i];
    result = combindTwoArray(result, e)
  }

  return result
}


export function nonAccentVietnamese(str) {
  str = str.toLowerCase()
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư
  return str
}


/**
 * @param data list string forSearch
 * @param text keyword search
 */
export const searchString = (data = [], text) => {
  if (typeof data === 'string') data = [data]
  const regex = new RegExp(nonAccentVietnamese(text), 'ig')
  return data.some((item) =>
    item ? regex.test(nonAccentVietnamese(item)) : item === text
  )
}
