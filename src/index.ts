import 'reflect-metadata'
import 'dotenv/config'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { PostResolver } from './resolvers/post'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { createConnection } from 'typeorm'
import { UserResolver } from './resolvers/user'
import { createVoteLoader } from './utils/createVoteLoader'
import { createUserLoader } from './utils/createUserLoader'
import { verify } from 'jsonwebtoken'
import { User } from './entities/User'
import { createAccessToken, createRefreshToken } from './utils/createToken'
import { sendRefreshToken } from './utils/sendRefreshToken'
import cookieparser from 'cookie-parser'
const main = async () => {

  const app = express()
  app.use(cookieparser())
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },)
  )

  app.post('/refresh_token', async(req,res) => {
    const token =req.cookies.jid
    //if refresh token unavailable
    if(!token) {
      return res.send({ok: false, accessToken: ''})
    }

    let payload:any = null

    try{
      payload = await verify(token, process.env.REFRESH_TOKEN_SECRET!)
    } catch(err) {
      //token exists but is invalid or expired
      return res.send({ok: false, accessToken: ''})
    }

    //find user with id from verified token
    const user = await User.findOne({id: payload.userId})

    //user not found
    if(!user) {
      return res.send({ ok: false, accessToken: ''})
    }

    //user found
    sendRefreshToken(res, createRefreshToken(user))
    return res.send({ ok: true, accessToken: createAccessToken(user) })

  })

  const conn = await createConnection()
  if(process.env.ENV === 'development'){
    conn.runMigrations()
  }
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver]
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({req, res }) => ({
      req,
      res,
      voteLoader: createVoteLoader(),
      userLoader: createUserLoader() 
    })
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({ app, cors:false })

  app.listen(4000, () => {
    console.log('server running at localhost:4000/graphql')
  })
}

main()