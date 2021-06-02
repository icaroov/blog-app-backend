import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/userModel'

import { ErrorHandler } from '../utils/errorHandler'
import { validateEmail, validatePhone } from '../utils/helperFunctions'

import {
  generateActiveToken,
  generateAccessToken,
  generateRefreshToken,
} from '../config/generateToken'
import { sendEmail } from '../config/sendEmail'
import { sendSms } from '../config/sendSms'

import { IDecodedUser, IUser } from '../types/User'

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
        sendEmail(account, url, 'Verify your email address')

        return res.json({
          status: 'success',
          message: 'Please, check your email to activate your account',
        })
      } else if (validatePhone(account)) {
        sendSms(account, url, 'Verify your phone number')

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

      const decodedUser = <IDecodedUser>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      )

      const { newUser } = decodedUser

      if (!newUser) throw new ErrorHandler(400, 'Invalid authentication')

      await User.create(newUser)

      res.json({
        status: 'success',
        message: 'Account has been actived!',
      })
    } catch (error) {
      if (error.message === 'jwt expired') {
        return res.status(500).json({
          status: 'error',
          statusCode: 500,
          message: 'Token expired',
        })
      }

      if (error.code === 11000) {
        return res.status(500).json({
          status: 'error',
          statusCode: 500,
          message: 'This account has already been activated',
        })
      }

      next()
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { account, password } = req.body

      const user = await User.findOne({ account })

      if (!user) throw new ErrorHandler(400, 'This account does not exists')

      loginUser(user, password, res)
    } catch (error) {
      next(error)
    }
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('refreshtoken', { path: '/api/refresh-token' })
      return res.json({ status: 'success', message: 'Logged out' })
    } catch (error) {
      next(error)
    }
  },
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refreshtoken

      if (!refresh_token) throw new ErrorHandler(400, 'Please, login now')

      const decodedToken = <IDecodedUser>(
        jwt.verify(refresh_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      )

      if (!decodedToken.id) throw new ErrorHandler(400, 'Please, login now')

      const user = await User.findById(decodedToken.id).select('-password')

      if (!user) throw new ErrorHandler(400, 'This account does not exists')

      const access_token = generateAccessToken({ id: user._id })

      res.json({ status: 'success', message: 'Refreshed token', access_token })
    } catch (error) {
      next(error)
    }
  },
}

const loginUser = async (user: IUser, password: string, res: Response) => {
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch)
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Password is incorrect',
    })

  const access_token = generateAccessToken({ id: user._id })
  const refresh_token = generateRefreshToken({ id: user._id })

  res.cookie('refreshtoken', refresh_token, {
    httpOnly: true,
    path: '/api/refresh-token',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  })

  res.json({
    status: 'success',
    message: 'Successful login',
    access_token,
    user: { ...user._doc, password: '' },
  })
}

export default authController
