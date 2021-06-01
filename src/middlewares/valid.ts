import { Request, Response, NextFunction } from 'express'

import { ErrorHandler } from '../utils/errorHandler'
import { validateEmail, validatePhone } from '../utils/helperFunctions'

export const validateRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, account, password } = req.body

    if (!name) throw new ErrorHandler(400, 'Please add your name')
    else if (name.length > 20)
      throw new ErrorHandler(400, 'Your name is up to 20 chars long')

    if (!account)
      throw new ErrorHandler(400, 'Please add your email or phone number')
    else if (!validatePhone(account) && !validateEmail(account))
      throw new ErrorHandler(400, 'Email or phone number format is incorrect')

    if (password.length < 6)
      throw new ErrorHandler(400, 'Password must be at least 6 chars')

    next()
  } catch (error) {
    next(error)
  }
}
