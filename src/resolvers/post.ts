import {Post} from '../entities/Post'
import {Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware} from 'type-graphql'
import { LoginMiddleware } from '../middlewares/loginMiddleware'
import MyContext from 'src/types/context'


@ObjectType()
class SinglePostReturnType {
  @Field(() => Post, {nullable: true})
    post?: Post

  @Field(() => String, {nullable: true})
    error?: string
}

@ObjectType()
class MultiplePostsReturnType {
  @Field(() => [Post], {nullable: true})
    posts?: Post[]

  @Field(() => String, {nullable: true})
    error?: string
}


@Resolver()
export class PostResolver {
  @Mutation(() => SinglePostReturnType)
  @UseMiddleware(LoginMiddleware)
  async createPost(
    @Arg('title') title: string,
    @Arg('content') content: string,
    @Ctx() { payload }: MyContext
  ): Promise<SinglePostReturnType> {
    console.log(payload)
    const post = await Post.create({title, content}).save()
    return {
      post,
    }
  }

  @Query(() => MultiplePostsReturnType)
  async posts()
  :Promise<MultiplePostsReturnType> {
    try{
      const posts = await Post.find({})
      return {
        posts
      }
    } catch(error) {
      throw new error(`Unable to find posts. ${error.message}`)
    }
  }

  @Query(() => SinglePostReturnType)
  async post(
    @Arg('id') id: number,
  ):Promise<SinglePostReturnType> {
    try {
      const post = await Post.findOne({id})
      return {
        post,
      }
    } catch (error) {
      throw new Error(`Unable to find post. ${error.message}`)        
    }
  }

  @Mutation(() => String, {nullable: true})
  async deleteAllPosts() {
    await Post.delete({})
    return 'Deleted all posts'
  }

  @Query(() => String)
  helloWorld() {
    return 'Hello World'
  }
}
