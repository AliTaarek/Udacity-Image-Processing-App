import { promises as fsPromises } from 'fs'
import path from 'path'
import supertest, { SuperTest, Test, Response } from 'supertest'
import app from '../index'
import File from '../routes/fileProcessing'

const request: SuperTest<Test> = supertest(app)

describe('Test responses from endpoints', (): void => {
  describe('endpoint: /', (): void => {
    it('gets /', async (): Promise<void> => {
      const response: Response = await request.get('/')
      expect(response.status).toBe(200)
    })
  })

  describe('endpoint: /api/images', (): void => {
    it('gets full image with filename=fjord from cache', async (): Promise<void> => {
      const response: Response = await request.get('/api/images?filename=fjord')
      expect(response.status).toBe(200)
    })

    it('gets thumb image with name=fjord & width=400 & height=400 (valid arguments)', async (): Promise<void> => {
      const response: Response = await request.get(
        '/api/images?filename=fjord&width=400&height=400'
      )
      expect(response.status).toBe(200)
    })

    it('gets the same thumb image with name=fjord & width=400 & height=400 from cache', async (): Promise<void> => {
      const response: Response = await request.get(
        '/api/images?filename=fjord&width=400&height=400'
      )
      expect(response.status).toBe(200)
    })

    it('gets /api/images with no arguments', async (): Promise<void> => {
      const response: Response = await request.get('/api/images')
      expect(response.status).toBe(200)
    })
  })

  describe('endpoint: /image', (): void => {
    it('returns 404 for invalid endpoint', async (): Promise<void> => {
      const response: Response = await request.get('/image')
      expect(response.status).toBe(404)
    })
  })
})

// Erase created test file.
afterAll(async (): Promise<void> => {
  const resizedImagePath: string = path.resolve(
    File.thumbImagesPath,
    'fjord-400x400.jpg'
  )

  try {
    await fsPromises.access(resizedImagePath)
    fsPromises.unlink(resizedImagePath)
  } catch {
    //catch errors
  }
})
