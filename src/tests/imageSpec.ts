import { promises as fsPromises } from 'fs'
import path from 'path'
import imageModule from '../routes/api/images'

describe('Test image processing', (): void => {
  it('raises an error (invalid name and width value)', async (): Promise<void> => {
    const error: null | string = await imageModule.createThumbImage(
      'foo',
      '-100',
      '500'
    )
    expect(error).not.toBeNull()
  })

  // Note: Could also fail because of directory permissions
  it('succeeds to create thumb image (valid image name and valid arguments)', async (): Promise<void> => {
    const error: null | string = await imageModule.createThumbImage(
      'santamonica',
      '245',
      '245'
    )
    expect(error).toBeNull()
  })
})

// Erase test file. Test should not run on productive system to avoid cache loss
afterAll(async (): Promise<void> => {
  const resizedImagePath: string = path.resolve(
    path.resolve(__dirname, '../../assets/images/thumb'),
    'santamonica-245x245.jpg'
  )

  try {
    await fsPromises.access(resizedImagePath)
    fsPromises.unlink(resizedImagePath)
  } catch {
    //catch errors
  }
})
