import qs from 'qs'

export const buildQueryUrl = (url, params) => {
  // eslint-disable-next-line import/no-named-as-default-member
  return url + qs.stringify(
    params,
    { encode: false, addQueryPrefix: true }
  )
}

export const getErrorMessage = error => error.response?.data?.message || error.message
