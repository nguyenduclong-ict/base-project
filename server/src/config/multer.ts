import { objectIdToString } from '@/helpers'
import { S3Client } from '@aws-sdk/client-s3'
import multer from 'multer'
import multerS3 from 'multer-s3'
import slugify from 'slugify'
import { ENV } from './env'
import shortid from 'shortid'

const s3 = new S3Client({
  endpoint: ENV.S3_ENDPOINT,
  region: ENV.S3_REGION,
  credentials: {
    accessKeyId: ENV.S3_ACCESS_KEY,
    secretAccessKey: ENV.S3_SECRET_KEY,
  },
})

export const upload = multer({})
