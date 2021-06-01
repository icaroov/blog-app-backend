import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { ErrorHandler } from '../utils/errorHandler'
import User from '../models/userModel'

const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, account, password } = req.body

      const userExists = await User.findOne({ account })

      if (userExists)
        throw new ErrorHandler(400, 'Email or Phone number already exists')

      const passwordHash = await bcrypt.hash(password, 12)

      const newUser = new User({
        name,
        account,
        password: passwordHash,
      })

      res.json({
        status: 'OK',
        message: 'Register successfully',
        data: newUser,
      })
    } catch (error) {
      throw new ErrorHandler(500, error.message)
    }
  },
}

export default authController
