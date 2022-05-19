import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import routes from './routes/index'

const PORT = process.env.PORT || 3000

// create an instance server
const app: Application = express()

// HTTP request logger middleware
app.use(morgan('dev'))

// routing for / path
app.get('/', (request: Request, response: Response): void => {
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
})

app.use('/api/images', routes)

// start express server
app.listen(PORT, () => {
  console.log(`Server is starting at port ${PORT}`)
})

export default app
