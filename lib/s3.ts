import { api } from '@/server/utils/api'

const loadImage = (url: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image()
    img.addEventListener(
      'load',
      () =>
        resolve({
          width: img.width,
          height: img.height,
        }),
      {
        once: true,
        passive: true,
      }
    )
    img.addEventListener('error', (err) => reject(err), {
      once: true,
      passive: true,
    })
    img.src = url
  })

export async function uploadImage(
  file: File,
  utils: ReturnType<(typeof api)['useContext']>
) {
  const { key, uploadUrl } = await utils.image.upload.fetch({
    fileType: file.type,
  })

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
  })

  if (response.status !== 200) {
    throw Error(await response.text())
  }

  const url = new URL(uploadUrl)
  url.search = ''

  const { width } = await loadImage(url.toString())

  return {
    url: url.toString(),
    originalFilename: file.name,
    width,
    dpi: undefined,
  }
}
