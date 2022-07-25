import { ENV } from '@/config'
import { s3 } from '@/config/s3'
import { MediaModel } from '@/database'
import { RequestHandler } from 'express'

export const getFileController: RequestHandler = async (req, res, next) => {
  const key = req.path.replace('/', '').trim()

  const media = await MediaModel.findOne({ s3_key: key })

  if (!media) return res.sendStatus(404)

  let s3_key = key
  if (req.query.thumbnail) s3_key += `?thumbnail=${req.query.thumbnail}`

  const data = await s3
    .getObject({
      Bucket: ENV.S3_BUCKET_NAME,
      Key: s3_key,
    })
    .promise()
    .catch(() => null)

  if (!data) return res.sendStatus(404)

  res.type(data.ContentType).send(data.Body)
}
