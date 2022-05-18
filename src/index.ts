import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import routes from './routes/index'

const PORT = process.env.PORT || 3000

// create an instance server
const app: Application = express()

// HTTP request logger middleware
app.use(morgan('dev'))

// routing for / path
app.use('/', routes)

// start express server
app.listen(PORT, () => {
  console.log(`Server is starting at port ${PORT}`)
})

export default app
