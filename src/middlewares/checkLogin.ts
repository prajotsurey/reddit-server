import { verify } from 'jsonwebtoken'
import MyContext from 'src/types/context'
import { myPayload } from 'src/types/payload'
import { MiddlewareFn } from 'type-graphql'

export const CheckLogin: MiddlewareFn<MyContext> = async ({ context }, next) => {
  
  const authorization = context.req.headers['authorization']
  if(!authorization) {
    return next()
  }
  try {
    const payload = verify(authorization.split(' ')[1], process.env.ACCESS_TOKEN_SECRET!)
    context.payload = payload as myPayload
    return next()
  } catch {
    return next()
  }
  
  /*

  Instead of throwing an error on invalid or missing token, we now do not set the payload object, thus keeping it undefined.
  The resolvers can choose to throw error inside their own code if they want to.
  This is done because have resolvers who work both with and without logged in user. i.e. with and without token in request.
  Throwing error here wouldn't work for these resolvers beacuse it would stop execution.
  Now these resolvers can just do 'not logged in' in execution instead. 
  */
}