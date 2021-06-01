import { Request, Response, NextFunction } from 'express'

import { ErrorHandler, handleError } from '../utils/errorHandler'

export const setErrorHandler = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleError(err, res)
}
