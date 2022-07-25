import { Request, RequestHandler } from 'express'
import shortid from 'shortid'
import { objectIdToString } from '@/helpers'
import slugify from 'slugify'
import { s3 } from '@/config/s3'
import { ENV } from '@/config'
import { MediaModel, MediaThumbnail } from '@/database'
import sharp from 'sharp'

function generateKey(file: Express.Multer.File, req: Request) {
  let key = ''
  if (req.user) {
    key += `${req.shopId}/${objectIdToString(req.user.id)}`
  } else {
    key += 'public'
  }
  key += `/${shortid()}-${slugify(file.originalname)}`

  return key
}

function generateMetadata(req: Request) {
  const metadata: any = {}
  if (req.user) {
    metadata.user = objectIdToString(req.user.id)
  }

  return metadata
}

export const uploadController: RequestHandler = async (req, res, next) => {
  if (!Array.isArray(req.files) || !req.files.length) return res.json([])

  const medias = await Promise.all(
    req.files.map(async (file) => {
      const key = generateKey(file, req)
      const metadata = generateMetadata(req)
      let dimension = null

      let thumbnails: MediaThumbnail[] = null

      if (file.mimetype.startsWith('image')) {
        const fileMeta = await sharp(file.buffer).metadata()
        dimension = `${fileMeta.width}x${fileMeta.height}`

        // create thumbnail square
        thumbnails = [
          //   {
          //     dimension: '500x500',
          //     s3_key: `${key}?thumbnail=500x500`,
          //   },
          {
            dimension: '200x200',
            s3_key: `${key}?thumbnail=200x200`,
          },
        ]

        await Promise.all(
          thumbnails.map(async (thum) => {
            return s3
              .putObject({
                Bucket: ENV.S3_BUCKET_NAME,
                Key: thum.s3_key,
                Metadata: metadata,
                ContentType: file.mimetype,
                Body: await sharp(file.buffer)
                  .resize({
                    width: +thum.dimension.split('x')[0] || undefined,
                    height: +thum.dimension.split('x')[1] || undefined,
                    fit: 'cover',
                  })
                  .toBuffer(),
              })
              .promise()
          })
        )
      }

      await s3
        .putObject({
          Bucket: ENV.S3_BUCKET_NAME,
          Key: key,
          Metadata: metadata,
          ContentType: file.mimetype,
          Body: file.buffer,
        })
        .promise()

      const media = await MediaModel.create({
        name: file.originalname,
        mimetype: file.mimetype,
        s3_key: key,
        dimension,
        user: req.user && objectIdToString(req.user),
        shop: req.shop && objectIdToString(req.shop),
        thumbnails,
      })

      return media
    })
  )

  return res.json(medias)
}
