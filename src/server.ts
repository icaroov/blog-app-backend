import dontenv from 'dotenv'
dontenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import routes from './routes'
import { setErrorHandler } from './middlewares/error'

const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(cors())
server.use(morgan('dev'))
server.use(cookieParser())

server.use('/api', routes.authRouter)

// error handler
server.use(setErrorHandler)

// connect to databse
import './config/database'

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log('⚡ Server is running on http://localhost:5000.')
})
