import { UserModel } from '@/db'
import {
  comparePassword,
  generateLoginToken,
  generateRefreshToken,
} from '@/helpers'
import { createValidate } from '@/helpers/validator'
import { IsString, MinLength } from 'class-validator'
import { RequestHandler } from 'express'
import { omit } from 'lodash'

class LoginBody {
  @IsString()
  @MinLength(4)
  username: string

  @IsString()
  @MinLength(6)
  password: string
}

const handler: RequestHandler = async (req, res, next) => {
  const body: LoginBody = req.body
  const user = await UserModel.findOne({ username: body.username }).populate(
    'roles'
  )
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

  if (!(await comparePassword(body.password, user.password))) {
    return req.sendError({
      code: 401,
      message: 'username or password mismatch',
    })
  }

  const [token, refresh_token] = await Promise.all([
    generateLoginToken(user.id),
    generateRefreshToken(user.id),
  ])

  res.json({
    token,
    refresh_token,
    user: omit(user.toJSON(), 'password'),
  })
}

export const loginController = [createValidate(LoginBody, 'body'), handler]
