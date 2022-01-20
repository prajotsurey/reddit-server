import DataLoader from 'dataloader'
import { Vote } from '../entities/Vote'

const batchFunction = async (keys: { postId: number, userId: number}[]) => {
  const votes = await Vote.findByIds(keys)
  const voteIdtoVote: Record<string, Vote> = {}
  votes.forEach(vote =>{
    voteIdtoVote[`${vote.postId}|${vote.userId}`] = vote
  })
  return keys.map(key => {
    if (voteIdtoVote[`${key.postId}|${key.userId}`]) {
      return voteIdtoVote[`${key.postId}|${key.userId}`].value
    } else {
      return 0
    }
  })
}

export const createVoteLoader = () =>
  new DataLoader<{ postId: number, userId: number}, number >(
    async keys => batchFunction(keys as any)
  )
