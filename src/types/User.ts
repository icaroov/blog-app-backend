export interface NewUser {
  name: string
  account: string
  password: string
}

export interface DecodedUser {
  newUser?: NewUser
  iat: number
  exp: number
}