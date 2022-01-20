import MyContext from 'src/types/context'
import { MiddlewareFn } from 'type-graphql'

export const CheckVoteValue: MiddlewareFn<MyContext> = async ({ args }, next) => {
  if(args.value === 1 || args.value === -1) return next()
  throw new Error('Invalid vote value')
}