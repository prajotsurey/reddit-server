import MyContext from 'src/types/context'
import { createPostResponse } from 'src/types/createPostResponse'
import { MiddlewareFn } from 'type-graphql'

export const CheckPostForm: MiddlewareFn<MyContext> = async ({ args }, next):Promise<createPostResponse> => {
  
  if(!args.title){
    return {
      errors: [
        {
          field: 'title',
          message: 'Title cannot be empty'
        }
      ]
    }
  } else if(!args.content) {
    return {
      errors:[
        {
          field: 'content',
          message: 'Content cannot be empty'
        }
      ]
    }
  }
  
  return next()
}