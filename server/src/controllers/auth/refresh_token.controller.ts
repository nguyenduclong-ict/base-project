import { UserModel } from '@/db'
import { generateLoginToken, sendError, verifyToken } from '@/helpers'
import { createValidate } from '@/helpers/validator'
import { IsString } from 'class-validator'
import { RequestHandler } from 'express'

class RefreshTokenBody {
  @IsString()
  refresh_token: string
}

export const refreshToken: RequestHandler<any, any, RefreshTokenBody> = async (
  req,
  res,
  next
) => {
  try {
    const tokenData = await verifyToken(req.body.refresh_token)
    const user = await UserModel.findOne({
      id: tokenData.userId,
    }).populate('roles')

    if (!user) {
      return req.sendError({
        code: 401,
        message: 'user not exist',
      })
    }

    if (!user.is_active) {
      return req.sendError({
        code: 401,
        message: 'user is disabled',
      })
    }

    const token = await generateLoginToken(user.id)

    res.json({ token })
  } catch (error) {
    req.sendError({ code: 401, message: error.toString() })
  }
}

export const refreshTokenController = [
  createValidate(RefreshTokenBody, 'body'),
  refreshToken,
]
