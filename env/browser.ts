import { bool, envsafe, str } from 'envsafe'

export const browserEnv = envsafe({
  NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD: bool({
    input: process.env.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD,
    default: false,
  }),

  NEXT_PUBLIC_STORAGE_PROVIDER: str({
    input: process.env.NEXT_PUBLIC_STORAGE_PROVIDER,
    choices: ['cloudinary', 's3'],
    allowEmpty: true,
  }),
})
