import { registerResponse } from 'src/resolvers/user'
import { MiddlewareFn } from 'type-graphql'

export const registerMiddleware: MiddlewareFn = async ({ args }, next):Promise<registerResponse> => {
  console.log(args)
  if(!args.options.email){
    return {
      errors:[
        {
          field: 'email',
          message: 'Email cannot be empty'
        }
      ]
    }
  } else if(!args.options.password){
    return {
      errors:[
        {
          field: 'password',
          message: 'Password cannot be empty'
        }
      ]
    }
  } else if(args.options.email.length < 8) {
    return {
      errors:[
        {
          field: 'email',
          message: 'Email must be atleast 8 characters long'
        }
      ]
    }
  } else if(args.options.password.length < 8) {
    return {
      errors:[
        {
          field: 'password',
          message: 'Password must be atleast 8 characters long'
        }
      ]
    }
  }
  return next()
}