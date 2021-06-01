import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/userModel'
import { ErrorHandler } from '../utils/errorHandler'
import { generateActiveToken } from '../config/generateToken'

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

      // await User.create(newUser)

      res.json({
        status: 'success',
        message: 'Register successfully',
        active_token,
        data: newUser,
      })
    } catch (error) {
      next(error)
    }
  },
}

export default authController
