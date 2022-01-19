import { Request, Response } from 'express'
import { myPayload } from './payload'

type MyContext = {
  req:Request
  res:Response
  payload: myPayload
}

export default MyContext