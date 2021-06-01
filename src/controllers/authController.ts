import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/userModel'
import { ErrorHandler } from '../utils/errorHandler'
import { generateActiveToken } from '../config/generateToken'
import { validateEmail } from '../utils/helperFunctions'
import sendEmail from '../config/sendEmail'

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
      }
    } catch (error) {
      next(error)
    }
  },
}

export default authController
