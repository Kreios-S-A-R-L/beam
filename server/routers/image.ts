import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'
import S3 from 'aws-sdk/clients/s3'
import { randomUUID } from 'crypto'
import { serverEnv } from '@/env/server'

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: serverEnv.AWS_ACCESS_KEY_ID,
  secretAccessKey: serverEnv.AWS_SECRET_ACCESS_KEY,
  region: serverEnv.AWS_REGION,
  signatureVersion: 'v4',
})

export const imageRouter = createProtectedRouter().query('upload', {
  input: z.object({
    fileType: z.string(),
  }),
  async resolve({ ctx, input: { fileType } }) {
    const ex = fileType.split('/')[1]

    const Key = `${randomUUID()}.${ex}`

    const s3Params = {
      Bucket: serverEnv.AWS_BUCKET,
      Key,
      Expires: 60,
      ContentType: `image/${ex}`,
    }

    const uploadUrl = await s3.getSignedUrl('putObject', s3Params)

    return {
      uploadUrl,
      key: Key,
    }
  },
})
