import { serverEnv } from '@/env/server'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'
// ...
const client = new S3Client({
  credentials: {
    accessKeyId: serverEnv.AWS_ACCESS_KEY_ID,
    secretAccessKey: serverEnv.AWS_SECRET_ACCESS_KEY,
  },
  region: serverEnv.AWS_REGION,
})

export const imageRouter = createProtectedRouter().query('upload', {
  input: z.object({
    fileType: z.string(),
  }),
  async resolve({ ctx, input: { fileType } }) {
    const ex = fileType.split('/')[1]

    const Key = `${randomUUID()}.${ex}`

    const command = new PutObjectCommand({
      Bucket: serverEnv.AWS_BUCKET,
      Key,
      ContentType: fileType,
    })

    const url = await getSignedUrl(client, command, { expiresIn: 60 })

    return {
      uploadUrl: url,
      key: Key,
    }
  },
})
