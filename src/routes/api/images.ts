import express, { Request, Response, Router, NextFunction } from 'express'
import { promises as fsPromises } from 'fs'
import path from 'path'
import imageProcessor from '../sharp'

// image router
const images: Router = express.Router()

// paths for full images and thumb images
const fullImagesPath = path.resolve(__dirname, '../../../assets/images/full')
const thumbImagesPath = path.resolve(__dirname, '../../../assets/images/thumb')

// static function to get the image path
const getImagePath = async (
  fileName: string,
  width: string,
  height: string
): Promise<null | string> => {
  let filePath: string
  if (width && height) {
    filePath = path.resolve(
      thumbImagesPath,
      `${fileName}-${width}x${height}.jpg`
    )
  } else {
    filePath = path.resolve(fullImagesPath, `${fileName}.jpg`)
  }
  // Check file existence
  try {
    await fsPromises.access(filePath)
    return filePath
  } catch {
    return null
  }
}
// return all available images in the images directory without the extension
const getAvailableImages = async (): Promise<string[]> => {
  try {
    const images: string[] = (await fsPromises.readdir(fullImagesPath)).map(
      (filename: string): string => filename.split('.')[0]
    )
    return images
  } catch {
    return []
  }
}

// check if the image exists or not
const checkImageExists = async (filename: string): Promise<boolean> => {
  if (!filename) {
    return false
  } else if (!(await getAvailableImages()).includes(filename)) {
    return false
  }
  return true
}

// applying caching by checking if the thumbnail exists already
const checkThumbExists = async (
  fileName: string,
  width: string,
  height: string
): Promise<boolean> => {
  // Set thumb path
  const filePath: string = path.resolve(
    thumbImagesPath,
    `${fileName}-${width}x${height}.jpg`
  )
  // try to access the thumb
  try {
    await fsPromises.access(filePath)
    return true
  } catch {
    return false
  }
}

// processing on the full image to create the thumbnail
const createThumbImage = async (
  fileName: string,
  width: string,
  height: string
): Promise<null | string> => {
  const fullImage: string = path.resolve(fullImagesPath, `${fileName}.jpg`)
  const thumbImage: string = path.resolve(
    thumbImagesPath,
    `${fileName}-${width}x${height}.jpg`
  )
  // Resize original image and store as thumb
  return await imageProcessor(
    fullImage,
    thumbImage,
    parseInt(width),
    parseInt(height)
  )
}
// middleware for validation of url query
const queryValidation = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const ImageName: string = request.query.filename as string
  const ImageWidth: string = request.query.width as string
  const ImageHeight: string = request.query.height as string
  // Check if requested file is available
  if (!(await checkImageExists(ImageName))) {
    const availableImages: string = (await getAvailableImages()).join(' / ')
    return response.send(
      `Image name must be one of this list: ${availableImages}.`
    )
  }
  // Check that width and height are valid
  if (ImageWidth || ImageHeight) {
    const width: number = parseInt(ImageWidth)
    const height: number = parseInt(ImageHeight)
    if (Number.isNaN(width) || width < 1) {
      return response.send('Image width must be positive number')
    }
    if (Number.isNaN(height) || height < 1) {
      return response.send('Image height must be positive number')
    }
  }
  next()
}

images.get(
  '/',
  queryValidation,
  async (request: Request, response: Response): Promise<void> => {
    const ImageName: string = request.query.filename as string
    const ImageWidth: string = request.query.width as string
    const ImageHeight: string = request.query.height as string
    let error: null | string = ''

    //If given width and height Create thumb if not already exists
    if (ImageWidth && ImageHeight) {
      if (!(await checkThumbExists(ImageName, ImageWidth, ImageHeight))) {
        error = await createThumbImage(ImageName, ImageWidth, ImageHeight)
      }
      // Handle image processing error
      if (error) {
        response.send(error)
        return
      }
    }
    // Retrieve appropriate image path and display image
    const path: null | string = await getImagePath(
      ImageName,
      ImageWidth,
      ImageHeight
    )
    if (path) {
      response.sendFile(path)
    } else {
      response.send('something wrong happened')
    }
  }
)

export default images
