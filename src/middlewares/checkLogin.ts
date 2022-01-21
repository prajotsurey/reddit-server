import { verify } from 'jsonwebtoken'
import MyContext from 'src/types/context'
import { myPayload } from 'src/types/payload'
import { MiddlewareFn } from 'type-graphql'

export const CheckLogin: MiddlewareFn<MyContext> = async ({ context }, next) => {
  
  const authorization = context.req.headers['authorization']
  if(!authorization) {
    return next()
  }

  const payload = verify(authorization.split(' ')[1], process.env.ACCESS_TOKEN_SECRET!)
  context.payload = payload as myPayload
  return next()
  
}