import jwt from 'jsonwebtoken'

const activeTokenSecret = `${process.env.ACTIVE_TOKEN_SECRET}`
const accessTokenSecret = `${process.env.ACCESS_TOKEN_SECRET}`
const refreshTokenSecret = `${process.env.REFRESH_TOKEN_SECRET}`

export const generateActiveToken = (payload: object) => {
  return jwt.sign(payload, activeTokenSecret, { expiresIn: '5m' })
}

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: '15m' })
}

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: '30d' })
}
