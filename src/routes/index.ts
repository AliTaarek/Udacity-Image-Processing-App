import express from 'express'
import imagesModule from './api/images'

const routes: express.Router = express.Router()

routes.get('/', imagesModule.images)

export default routes
