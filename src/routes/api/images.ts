import express, { Request, Response, Router, NextFunction } from 'express'
import File from '../fileProcessing'

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
  if (!(await File.checkImageExists(ImageName))) {
    const availableImages: string = (await File.getAvailableImages()).join(
      ' / '
    )
    return response.send(
      `Image name must be one of this list: ${availableImages}.`
    )
  }
  // Check that width and height are valid
  if (ImageWidth || ImageHeight) {
    const width: number = parseInt(ImageWidth || '')
    if (Number.isNaN(width) || width < 1) {
      return response.send('Image width must be positive number')
    }

    const height: number = parseInt(ImageHeight || '')
    if (Number.isNaN(height) || height < 1) {
      return response.send('Image height must be positive number')
    }
  }
  next()
}

// image router
const images: Router = express.Router()

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
      if (!(await File.checkThumbExists(ImageName, ImageWidth, ImageHeight))) {
        error = await File.createThumbImage(ImageName, ImageWidth, ImageHeight)
      }
      // Handle image processing error
      if (error) {
        response.send(error)
        return
      }
    }

    // Retrieve appropriate image path and display image
    const path: null | string = await File.getImagePath(
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
