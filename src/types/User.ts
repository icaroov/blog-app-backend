import { Document } from 'mongoose'

export interface IUser extends Document {
  _doc: object
  name: string
  account: string
  password: string
  avatar?: string
  role?: 'user' | 'admin'
  type?: 'register' | 'login'
}

export interface INewUser {
  name: string
  account: string
  password: string
}

export interface IDecodedUser {
  id?: string
  newUser?: INewUser
  iat: number
  exp: number
}
