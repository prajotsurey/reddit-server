import { User } from '../entities/User'
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from 'type-graphql'
import bcrypt from 'bcrypt'
import MyContext from '../types/context'
import { createAccessToken, createRefreshToken } from '../utils/createToken'

@InputType()
class userInput{
  
  @Field()
    email: string
  
  @Field()
    password: string
} 


@ObjectType()
class loginResponse{

  @Field(() => String, {nullable:true})
    token?: string

  @Field(() => String, {nullable:true})
    error?: string
}

Resolver()
export class UserResolver {
  @Mutation(() => User, { nullable: true})
  async registerUser(
    @Arg('options') options: userInput
  ): Promise<User | null> {
    try {
      const passwordHash = await bcrypt.hash(options.password,10)
      const user = await User.create({
        email: options.email,
        passwordHash
      }).save()
      return user
    } catch (error) {
      if(error.code === 23505) {
        throw new Error(`Unable to create post. ${error.message}`)
      }
      throw error
    }
  }

  @Mutation(() => loginResponse)
  async login(
    @Arg('options') options: userInput,
    @Ctx() { res }: MyContext
  ): Promise<loginResponse> {

    const user = await User.findOne({email:options.email})
    if(!user) {
      return {
        error: 'user not found'
      }
    }

    const valid = await bcrypt.compare(options.password, user.passwordHash)

    if(valid) {
      try{
        res.cookie('jid', createRefreshToken(user))
        return {
          token: await createAccessToken(user)
        }
      } catch(error){
        return{
          error
        }
      }
    } 
    return {
      error: 'invalid password'
    }

  }

}