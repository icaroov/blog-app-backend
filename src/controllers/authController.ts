import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/userModel'

import { ErrorHandler } from '../utils/errorHandler'
import { validateEmail, validatePhone } from '../utils/helperFunctions'

import { generateActiveToken } from '../config/generateToken'
import { sendEmail } from '../config/sendEmail'
import { sendSms } from '../config/sendSms'
import { DecodedUser } from '../types/User'

const CLIENT_URL = `${process.env.BASE_URL}`

const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, account, password } = req.body

      const userExists = await User.findOne({ account })

      if (userExists)
        throw new ErrorHandler(400, 'Email or Phone number already exists')

      const passwordHash = await bcrypt.hash(password, 12)

      const newUser = {
        name,
        account,
        password: passwordHash,
      }

      const active_token = generateActiveToken({ newUser })

      const url = `${CLIENT_URL}/active/${active_token}`

      if (validateEmail(account)) {
        sendEmail(account, url, 'Verify your email address.')

        return res.json({
          status: 'success',
          message: 'Please, check your email to activate your account',
        })
      } else if (validatePhone(account)) {
        sendSms(account, url, 'Verify your phone number.')

        return res.json({
          status: 'success',
          message: 'Please, check your phone messages to activate your account',
        })
      }
    } catch (error) {
      next(error)
    }
  },
  activeAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { active_token } = req.body

      const decodedUser = <DecodedUser>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      )

      const { newUser } = decodedUser

      if (!newUser) throw new ErrorHandler(400, 'Invalid authentication.')

      await User.create(newUser)

      res.json({
        status: 'success',
        message: 'Account has been actived!',
      })
    } catch (error) {
      if (error.message === 'jwt expired') {
        return res.status(500).json({
          status: 'error',
          message: 'Token expired',
        })
      }

      if (error.code === 11000) {
        return res.status(500).json({
          status: 'error',
          message: 'This account has already been activated',
        })
      }

      next()
    }
  },
}

export default authController
