/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'avatars.githubusercontent.com',

      'lh3.googleusercontent.com',

      ...(process.env.NEXT_PUBLIC_STORAGE_PROVIDER === 's3'
        ? [
            `${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`,
          ]
        : []),
    ],
  },
}
