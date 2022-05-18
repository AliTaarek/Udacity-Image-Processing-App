import express from 'express'
import images from './api/images'

const routes: express.Router = express.Router()

routes.use('/api/images', images)

routes.get(
  '/',
  (request: express.Request, response: express.Response): void => {
    response.send(
      `<h1>project image processing api</h1>
      <p>to use application write in the url /api/images?filename=(enter valid image here) width and hight is optional</p>
      <p>for example:
        <ul>
            <li>/api/images?filename=santamonica</li>
            <li> Or you can define the width and the height of the photo as shown : /api/images?filename=santamonica&width=300&height=300</li>
        </ul>
      </p>`
    )
  }
)

export default routes
