import DataLoader from 'dataloader'
import { User } from '../entities/User'

const batchFunction = async (userIds: number[]) => {
  const users = await User.findByIds(userIds)
  const userIdtoUser: Record<string, User> = {}
  users.forEach(user =>{
    userIdtoUser[user.id] = user
  })
  return userIds.map(userId => userIdtoUser[userId])
}

export const createUserLoader = () =>
  new DataLoader<number, User >(
    async keys => batchFunction(keys as any)
  )
