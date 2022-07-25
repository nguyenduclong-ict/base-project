import AWS from 'aws-sdk'
import { ENV } from './env'

export const s3 = new AWS.S3({
  endpoint: ENV.S3_ENDPOINT,
  region: ENV.S3_REGION,
  sslEnabled: true,
  s3ForcePathStyle: true,
  credentials: new AWS.Credentials({
    accessKeyId: ENV.S3_ACCESS_KEY,
    secretAccessKey: ENV.S3_SECRET_KEY,
  }),
})
