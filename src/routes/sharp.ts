import sharp from 'sharp'

const imageProcessor = async (
  source: string,
  target: string,
  width: number,
  height: number
): Promise<null | string> => {
  try {
    await sharp(source).resize(width, height).toFormat('jpg').toFile(target)
    return null
  } catch {
    return 'Error while processing the image.'
  }
}

export default imageProcessor
