import { Request, Response } from 'express'
import { createUserLoader } from '../utils/createUserLoader'
import { createVoteLoader } from '../utils/createVoteLoader'
import { myPayload } from './payload'

type MyContext = {
  req:Request
  res:Response
  payload: myPayload
  voteLoader: ReturnType<typeof createVoteLoader>
  userLoader: ReturnType<typeof createUserLoader>
  loggedIn: boolean
}

export default MyContext