import express from 'express'
import images from './api/images'

const routes: express.Router = express.Router()

routes.get('/', images)

export default routes
