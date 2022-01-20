import { Request, Response } from 'express'
import { createVoteLoader } from 'src/utils/voteLoader'
import { myPayload } from './payload'

type MyContext = {
  req:Request
  res:Response
  payload: myPayload,
  voteLoader: ReturnType<typeof createVoteLoader>
}

export default MyContext