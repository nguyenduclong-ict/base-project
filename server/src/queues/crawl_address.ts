import { ENV } from '@/config'
import { LocationModel } from '@/database'
import logger from '@/helpers/logger'
import axios from 'axios'
import Queue from 'bull'

const apiUrl = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data'

export const provinceQueue = new Queue('provinceQueue', ENV.REDIS_URL)
export const districtQueue = new Queue<{ province_id: number }>(
  'districtQueue',
  ENV.REDIS_URL
)
export const wardQueue = new Queue<{ district_id: number }>(
  'wardQueue',
  ENV.REDIS_URL
)

provinceQueue.process(5, async () => {
  console.log('crawl province')

  try {
    const endpoint = `${apiUrl}/province`

    const {
      data: { data },
    } = await axios.get(endpoint, {
      headers: {
        Token: ENV.GHN_TOKEN,
      },
    })

    await Promise.all(
      data.map((provinceData: any) => {
        return LocationModel.findOne({
          province_id: provinceData.ProvinceID,
          type: 'province',
        })
          .then((doc) => {
            if (doc) {
              return doc.update({
                province_code: provinceData.Code,
                name: provinceData.ProvinceName,
              })
            } else {
              return LocationModel.create({
                province_id: provinceData.ProvinceID,
                province_code: provinceData.Code,
                name: provinceData.ProvinceName,
                type: 'province',
              })
            }
          })
          .then(() =>
            districtQueue.add({ province_id: provinceData.ProvinceID })
          )
      })
    )
  } catch (error) {
    logger.error('crawl province error', error)
  }
})

districtQueue.process(5, async ({ data }) => {
  logger.info('crawl district', data)

  try {
    const province = await LocationModel.findOne({
      province_id: data.province_id,
    })

    if (!province) return

    const endpoint = `${apiUrl}/district`

    const {
      data: { data: districts },
    } = await axios.get(endpoint, {
      params: {
        province_id: data.province_id,
      },
      headers: {
        Token: ENV.GHN_TOKEN,
      },
    })

    await Promise.all(
      districts.map((districtData: any) => {
        return LocationModel.findOne({
          district_id: districtData.DistrictID,
          type: 'district',
        })
          .then((doc) => {
            if (doc) {
              return doc.update({
                province_id: districtData.ProvinceID,
                province_code: province.province_code,
                district_id: districtData.DistrictID,
                district_code: districtData.Code,
                name: districtData.DistrictName,
              })
            } else {
              return LocationModel.create({
                province_id: districtData.ProvinceID,
                province_code: province.province_code,
                district_id: districtData.DistrictID,
                district_code: districtData.Code,
                name: districtData.DistrictName,
                type: 'district',
              })
            }
          })
          .then(() =>
            wardQueue.add(
              { district_id: districtData.DistrictID },
              { attempts: 0 }
            )
          )
      })
    )
  } catch (error) {
    logger.error('crawl district error', error)
  }
})

wardQueue.process(5, async ({ data }) => {
  logger.info('crawl ward', data)

  try {
    const district = await LocationModel.findOne({
      district_id: data.district_id,
    })

    if (!district) return

    const endpoint = `${apiUrl}/ward`

    const {
      data: { data: wards },
    } = await axios.get(endpoint, {
      params: {
        district_id: data.district_id,
      },
      headers: {
        Token: ENV.GHN_TOKEN,
      },
    })

    if (Array.isArray(wards)) {
      await Promise.all(
        wards.map((wardData: any) => {
          return LocationModel.findOne({
            ward_code: wardData.WardCode,
            type: 'ward',
          }).then((doc) => {
            if (doc) {
              return doc.update({
                district_id: wardData.DistrictID,
                district_code: district.district_code,
                province_code: district.province_code,
                ward_code: wardData.WardCode,
                name: wardData.WardName,
                type: 'ward',
              })
            } else {
              return LocationModel.create({
                district_id: wardData.DistrictID,
                district_code: district.district_code,
                province_code: district.province_code,
                ward_code: wardData.WardCode,
                name: wardData.WardName,
                type: 'ward',
              })
            }
          })
        })
      )
    }
  } catch (error) {
    logger.error('crawl ward error', error)
  }
})
