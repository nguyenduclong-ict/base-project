import { ENV } from '@/config'
import { s3 } from '@/config/s3'
import { MediaModel } from '@/database'
import { RequestHandler } from 'express'

export const deleteMediaController: RequestHandler = async (req, res, next) => {
  try {
    const ids = req.params.id.split('+').map((id) => id.trim())

    if (ids.length === 0) {
      return res.json({
        deletedCount: 0,
      })
    }

    const queryDelete: any = { _id: { $in: ids } }
    if (req.shopId) queryDelete.shop = req.shopId

    const medias = await MediaModel.find(queryDelete)

    // delete file in bucket
    await Promise.all(
      medias.map((media) =>
        s3
          .deleteObject({ Key: media.s3_key, Bucket: ENV.S3_BUCKET_NAME })
          .promise()
          .catch((e) => null)
      )
    )

    const result = await MediaModel.deleteMany(queryDelete, {})
    res.json(result)
  } catch (error: any) {
    console.error('delete Media Controller error', error)
    req.sendError({ code: 500, message: error.message || error.name })
  }
}
