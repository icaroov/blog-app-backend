import { model, Schema, Model, Document } from 'mongoose'

type UserTypes = {
  name: string
  account: string
  password: string
  avatar: string
  type: 'normal' | 'fast'
} & Document

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
    type: {
      type: String,
      default: 'normal', // fast
    },
  },
  { timestamps: true }
)

const User: Model<UserTypes> = model('User', userSchema)

export default User
