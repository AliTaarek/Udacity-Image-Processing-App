import supertest, { SuperTest, Test, Response } from 'supertest'
import app from '../index'

const request: SuperTest<Test> = supertest(app)

describe('Test responses from endpoints', (): void => {
  describe('endpoint: /', (): void => {
    it('gets /', async (): Promise<void> => {
      const response: Response = await request.get('/')
      expect(response.status).toBe(200)
    })
  })

  describe('endpoint: /api/images', (): void => {
    it('gets /api/images with no arguments', async (): Promise<void> => {
      const response: Response = await request.get('/api/images')
      expect(response.status).toBe(200)
    })
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
  })

  describe('endpoint: /image', (): void => {
    it('returns 404 for invalid endpoint', async (): Promise<void> => {
      const response: Response = await request.get('/image')
      expect(response.status).toBe(404)
    })
  })
})
