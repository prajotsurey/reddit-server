import {sign} from 'jsonwebtoken'
import {User} from '../entities/User'

export const createAccessToken = (user: User): string => {
  return sign({userId: user.id}, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15m',
  })
}

export const createRefreshToken = (user: User): string => {
  return sign({userId: user.id}, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d',
  })
}