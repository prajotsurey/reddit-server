import {Post} from '../entities/Post'
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from 'type-graphql'
import { CheckLogin } from '../middlewares/checkLogin'
import MyContext from '../types/context'
import { createPostResponse } from '../types/createPostResponse'
import { User } from '../entities/User'
import { CheckPostForm } from '../middlewares/checkPostForm'

@Resolver()
export class PostResolver {
  @Mutation(() => createPostResponse)
  @UseMiddleware(CheckLogin)
  @UseMiddleware(CheckPostForm)
  async createPost(
    @Arg('title') title: string,
    @Arg('content') content: string,
    @Ctx() { payload }: MyContext
  ): Promise<createPostResponse> {
    if(!payload){
      throw new Error('Unable to create post. Try logging in again.')
    }

    const user = await User.findOne({ id: payload.userId })
    if(!user) {
      throw new Error('Unable to find logged in user. Try logging in  again.')
    }

    try {
      const post = await Post.create({
        title,
        content,
        creator: user
      }).save()
      return {
        post
      }
    } catch(error) {
      throw new Error(`Unable to create post. ${error.message}`)
    }
  }

  @Query(() => [Post])
  @UseMiddleware(CheckLogin)
  async posts()
  :Promise<Post[]> {
    try{
      return await Post.find({})
    } catch(error) {
      throw new error(`Unable to find posts. ${error.message}`)
    }
  }

  @Query(() => Post)
  async post(
    @Arg('id') id: number,
  ):Promise<Post> {
    const post = await Post.findOne({id}, {relations:['creator']})
    if(post) {
      return post
    }
    throw new Error('Unable to find post.')
  }


  @Mutation(() => String)
  @UseMiddleware(CheckLogin)
  async deletePost(
    @Arg('id') id: number,
    @Ctx() { payload }: MyContext
  ):Promise<string> {

    if(!payload){
      throw new Error('Error while deleting post. Try logging in again.')
    }

    const user = await User.findOne({ id: payload.userId })
    if(!user) {
      throw new Error('Error while deleting post. User not found. Try logging in again')
    }

    const post = await Post.findOne({ id }, {relations: ['creator']})
    if(!post) {
      throw new Error('Error while deleting post. Post not found.')
    }
    
    if( post.creator.id != user.id ){
      throw new Error('Error while deleting post. User can only delete their own posts.')
    }

    await post.remove()

    return 'Post deleted successfully'
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
