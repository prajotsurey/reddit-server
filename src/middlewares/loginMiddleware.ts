import { verify } from 'jsonwebtoken'
import MyContext from 'src/types/context'
import { myPayload } from 'src/types/payload'
import { MiddlewareFn } from 'type-graphql'

export const LoginMiddleware: MiddlewareFn<MyContext> = async ({ context }, next) => {
  
  const authorization = context.req.headers['authorization']
  if(!authorization) {
    return {
      error: 'User is not logged in'
    }
  }
  try{
    const payload = verify(authorization.split(' ')[1], process.env.ACCESS_TOKEN_SECRET!)
    context.payload = payload as myPayload
    return next()
  } catch(error) {
    return {
      error: error.message
    }
  }
  
}