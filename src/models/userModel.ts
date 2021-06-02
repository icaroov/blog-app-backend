import { model, Schema, Model } from 'mongoose'

import { IUser } from '../types/User'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add your name'],
      trim: true,
      maxLength: [20, 'Your name is up to 20 characters long'],
    },
    account: {
      type: String,
      required: [true, 'Please add your email or phone'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add your password'],
      trim: true,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/ddi5agea1/image/upload/v1622569308/default-avatar.png',
    },
    role: {
      type: String,
      default: 'user',
    },
    type: {
      type: String,
      default: 'register',
    },
  },
  { timestamps: true }
)

const User: Model<IUser> = model('User', userSchema)

export default User
