import { promises as fsPromises } from 'fs'
import path from 'path'
import imageProcessor from './imageProcessing'

export default class File {
  // define full and thumb images path
  static fullImagesPath = path.resolve(__dirname, '../../assets/images/full')
  static thumbImagesPath = path.resolve(__dirname, '../../assets/images/thumb')

  // static function to get the image path
  static async getImagePath(
    fileName: string,
    width: string,
    height: string
  ): Promise<null | string> {
    const filePath: string =
      width && height
        ? path.resolve(
            File.thumbImagesPath,
            `${fileName}-${width}x${height}.jpg`
          )
        : path.resolve(File.fullImagesPath, `${fileName}.jpg`)

    // Check file existence
    try {
      await fsPromises.access(filePath)
      return filePath
    } catch {
      return null
    }
  }

  // check if the image exists or not
  static async checkImageExists(filename: string): Promise<boolean> {
    if (!filename) {
      return false
    }
    return (await File.getAvailableImages()).includes(filename)
  }

  // return all available images in the images directory without the extension
  static async getAvailableImages(): Promise<string[]> {
    try {
      return (await fsPromises.readdir(File.fullImagesPath)).map(
        (filename: string): string => filename.split('.')[0]
      )
    } catch {
      return [File.fullImagesPath]
    }
  }

  // applying caching by checking if the thumbnail exists already
  static async checkThumbExists(
    fileName: string,
    width: string,
    height: string
  ): Promise<boolean> {
    if (!fileName || !width || !height) {
      return false
    }
    // Set thumb path
    const filePath: string = path.resolve(
      File.thumbImagesPath,
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

  // creating thumb folder if doesn't exist
  static async checkThumbFolder(): Promise<void> {
    try {
      await fsPromises.access(File.thumbImagesPath)
    } catch {
      fsPromises.mkdir(File.thumbImagesPath)
    }
  }

  // processing on the full image to create the thumbnail
  static async createThumbImage(
    fileName: string,
    width: string,
    height: string
  ): Promise<null | string> {
    const fullImagePath: string = path.resolve(
      File.fullImagesPath,
      `${fileName}.jpg`
    )
    const thumbImagePath: string = path.resolve(
      File.thumbImagesPath,
      `${fileName}-${width}x${height}.jpg`
    )

    // Resize original image and store as thumb
    return await imageProcessor(
      fullImagePath,
      thumbImagePath,
      parseInt(width),
      parseInt(height)
    )
  }
}
