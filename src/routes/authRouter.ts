import express from 'express'

import authController from '../controllers/authController'
import { validateRegister } from '../middlewares/valid'

const router = express.Router()

router.post('/register', validateRegister, authController.register)

export default router
