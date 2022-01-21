import {Post} from '../entities/Post'
import {Arg, Ctx, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware} from 'type-graphql'
import { CheckLogin } from '../middlewares/checkLogin'
import MyContext from '../types/context'
import { createPostResponse } from '../types/createPostResponse'
import { User } from '../entities/User'
import { CheckPostForm } from '../middlewares/checkPostForm'
import { Vote } from '../entities/Vote'
import { CheckVoteValue } from '../middlewares/checkVoteValue'
import { getConnection } from 'typeorm'

@ObjectType()
class PaginatedPostsResponse{
  
  @Field(() => [Post])
    posts: Post[]

  @Field(() => Boolean)
    hasMore: boolean
}

@Resolver(Post)
export class PostResolver {

  @FieldResolver()
  async voteStatus(
    @Root() post: Post,
    @Ctx() { payload, voteLoader }: MyContext
  ){
    return await voteLoader.load({
      postId: post.id, 
      userId: payload.userId})
  }

  @FieldResolver()
  async creator(
    @Root() post: Post,
    @Ctx() { payload, userLoader }: MyContext
  ){
    return await userLoader.load(post.creatorId)
  }


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


  @Query(() => PaginatedPostsResponse)
  @UseMiddleware()
  async paginatedPosts(
    @Arg('cursor', () => String, { nullable:true }) cursor?: string, 
  ):Promise<PaginatedPostsResponse>{

    const replacements:string[] = []

    if (cursor){
      replacements.push(cursor)
    }

    // call 11 posts
    const posts = await getConnection().query(
      `
      select * from "post"
      ${cursor ? 'where "createdAt" < $1': ''}
      order by "createdAt" DESC
      limit 11
      `,
      replacements
    )

    //if 11th post exists. return hasMore : true
    if(posts[10]) {
      return {
        posts,
        hasMore: true
      }
    }

    return {
      posts,
      hasMore: false
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
  @UseMiddleware(CheckLogin, CheckVoteValue)
  async vote(
    @Arg('value') value: number,
    @Arg('id') id: number, 
    @Ctx() { payload }: MyContext
  ):Promise<string>{
    if(!payload){
      throw new Error('Error while voting post. Try logging in again.')
    }

    const user = await User.findOne({ id: payload.userId })
    if(!user) {
      throw new Error('Error while voting post. User not found. Try logging in again')
    }

    const post = await Post.findOne({ id }, {relations: ['creator', 'votes']})
    if(!post) {
      throw new Error('Error while deleting post. Post not found.')
    }

    const vote = await Vote.findOne({ userId: user.id, postId: post.id })
    console.log(vote)
      
    if(!vote) {
      console.log('vote does not exists')
      post.voteCount = post.voteCount + value
      post.save()  
    
      await Vote.create({
        userId: user.id,
        postId: post.id,
        post: post,
        user: user,
        value: value
      }).save()

      return `vote added. Vote count: ${post.voteCount}`
    } else {
      console.log('vote exists')
      if(vote.value === value){
        await vote.remove()
        post.voteCount -= vote.value
        post.save()
        return `vote removed. Vote count: ${post.voteCount}`
      } else {
        vote.value = value
        vote.save()
        post.voteCount += 2*vote.value
        post.save()
        return `vote reversed. Vote count: ${post.voteCount}`
      }
    }

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
