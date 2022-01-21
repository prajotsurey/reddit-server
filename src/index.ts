import 'reflect-metadata'
import 'dotenv/config'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { PostResolver } from './resolvers/post'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { createConnection } from 'typeorm'
import { UserResolver } from './resolvers/user'
import { createVoteLoader } from './utils/createVoteLoader'
import { createUserLoader } from './utils/createUserLoader'
const main = async () => {

  const app = express()
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

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log('server running at localhost:4000/graphql')
  })
}

main()