import 'reflect-metadata'
import 'dotenv/config'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { PostResolver } from './resolvers/post'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { createConnection } from 'typeorm'
import { UserResolver } from './resolvers/user'
const main = async () => {

  const app = express()
  await createConnection()
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver]
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({ req, res }) => ({ req, res })
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log('server running at localhost:4000/graphql')
  })
}

main()