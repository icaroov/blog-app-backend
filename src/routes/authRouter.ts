import express from 'express'

import authController from '../controllers/authController'
import { validateRegister } from '../middlewares/valid'

const router = express.Router()

router.post('/register', validateRegister, authController.register)

router.post('/active-account', authController.activeAccount)

router.post('/login', authController.login)

router.get('/logout', authController.logout)

router.get('/refresh-token', authController.refreshToken)

export default router
