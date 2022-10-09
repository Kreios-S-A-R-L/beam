import {
  bool,
  envsafe,
  invalidEnvError,
  makeValidator,
  str,
  url,
} from 'envsafe'
import { browserEnv } from './browser'

if (process.browser) {
  throw new Error(
    'This should only be included on the client (but the env vars wont be exposed)'
  )
}

const githubParser = makeValidator<string>((input) => {
  if (process.env.AUTH_PROVIDER === 'github' && input === '') {
    throw invalidEnvError('github config', input)
  }
  return input
})

const googleParser = makeValidator<string>((input) => {
  if (process.env.AUTH_PROVIDER === 'google' && input === '') {
    throw invalidEnvError('google config', input)
  }
  return input
})

const oktaParser = makeValidator<string>((input) => {
  if (process.env.AUTH_PROVIDER === 'okta' && input === '') {
    throw invalidEnvError('okta config', input)
  }
  return input
})

const cloudinaryParser = makeValidator<string>((input) => {
  if (
    browserEnv.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD &&
    browserEnv.NEXT_PUBLIC_STORAGE_PROVIDER === 'cloudinary' &&
    input === ''
  ) {
    throw invalidEnvError('cloudinary config', input)
  }
  return input
})

const s3Parser = makeValidator<string>((input) => {
  if (
    browserEnv.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD &&
    browserEnv.NEXT_PUBLIC_STORAGE_PROVIDER === 's3' &&
    input === ''
  ) {
    throw invalidEnvError('s3 config', input)
  }
  return input
})

const slackParser = makeValidator<string>((input) => {
  if (process.env.ENABLE_SLACK_POSTING && input === '') {
    throw invalidEnvError('slack config', input)
  }
  return input
})

export const serverEnv = {
  ...browserEnv,
  ...envsafe({
    DATABASE_URL: str(),
    NEXT_APP_URL: slackParser({
      allowEmpty: true,
      devDefault: 'http://localhost:3000',
    }),
    NEXTAUTH_SECRET: str({
      devDefault: 'xxx',
    }),
    AUTH_PROVIDER: str({
      choices: ['github', 'okta', 'google'],
    }),
    NEXT_PUBLIC_STORAGE_PROVIDER: str({
      choices: ['cloudinary', 's3'],
      allowEmpty: true,
    }),
    // github
    GITHUB_ID: githubParser({ allowEmpty: true, default: '' }),
    GITHUB_SECRET: githubParser({ allowEmpty: true, default: '' }),
    GITHUB_ALLOWED_ORG: githubParser({ allowEmpty: true, default: '' }),
    // google
    GOOGLE_CLIENT_ID: googleParser({ allowEmpty: true, default: '' }),
    GOOGLE_CLIENT_SECRET: googleParser({ allowEmpty: true, default: '' }),
    // okta
    OKTA_CLIENT_ID: oktaParser({ allowEmpty: true, default: '' }),
    OKTA_CLIENT_SECRET: oktaParser({ allowEmpty: true, default: '' }),
    OKTA_ISSUER: oktaParser({ allowEmpty: true, default: '' }),
    // s3
    AWS_ACCESS_KEY_ID: s3Parser({ allowEmpty: true, default: '' }),
    AWS_SECRET_ACCESS_KEY: s3Parser({ allowEmpty: true, default: '' }),
    AWS_REGION: s3Parser({ allowEmpty: true, default: '' }),
    AWS_BUCKET: s3Parser({ allowEmpty: true, default: '' }),
    // cloudinary
    CLOUDINARY_CLOUD_NAME: cloudinaryParser({ allowEmpty: true, default: '' }),
    CLOUDINARY_API_KEY: cloudinaryParser({ allowEmpty: true, default: '' }),
    CLOUDINARY_API_SECRET: cloudinaryParser({ allowEmpty: true, default: '' }),
    // slack
    ENABLE_SLACK_POSTING: bool({ default: false }),
    SLACK_WEBHOOK_URL: slackParser({ allowEmpty: true, default: '' }),
  }),
}
