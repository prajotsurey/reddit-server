import { User } from '../entities/User'
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql'
import bcrypt from 'bcrypt'
import MyContext from '../types/context'
import { createAccessToken, createRefreshToken } from '../utils/createToken'
import { FormFieldError } from '../types/formErrors'
import { registerMiddleware } from '../middlewares/registerMiddleware'
import { registerResponse } from '../types/registerResponse'
import { CheckLogin } from '../middlewares/checkLogin'
import { sendRefreshToken } from '../utils/sendRefreshToken'

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

  @Field(() => [FormFieldError], {nullable:true})
    errors?: FormFieldError[]
}

Resolver()
export class UserResolver {
  
  @Query(() => User, {nullable: true} )
  @UseMiddleware(CheckLogin)
  async Me(
    @Ctx() { payload }: MyContext
  ):Promise<User|null>{
    if(!payload){
      return null
    }
    const user =  await User.findOne({id: payload.userId})
 
    if(user){
      return user
    }

    else {
      return null
    }
  }


  @Mutation(() => registerResponse)
  @UseMiddleware(registerMiddleware)
  async registerUser(
    @Arg('options') options: userInput
  ): Promise<registerResponse> {
    try {
      const passwordHash = await bcrypt.hash(options.password,10)
      const user = await User.create({
        email: options.email,
        passwordHash
      }).save()
      return {
        user
      }
    } catch (error) {
      if(error.code === '23505') {
        return {
          errors:[
            {
              field: 'email',
              message: 'A user with that email already exists. Please use another email.'
            }
          ]
        }
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
    
    if(!options.email) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Email cannot be empty'
          }
        ]
      }
    }

    if(!options.password) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Password cannot be empty'
          }
        ]
      }
    }

    //if user is not found
    if(!user) {
      return{
        errors: [
          {
            field: 'email',
            message: 'A user with that email does not exist'
          }
        ]
      }
    }

    const valid = await bcrypt.compare(options.password, user.passwordHash)
    
    //if user is found and password is valid
    if(valid) {
      sendRefreshToken(res,createRefreshToken(user))
      return {
        token : await createAccessToken(user)
      }
    } 

    //if user is found but password is incorrect
    return{
      errors: [
        {
          field: 'password',
          message: 'Invalid password'
        }
      ]
    }

  }


  @Mutation(() => String)
  logout(
    @Ctx() { res }:MyContext
  ){
    res.cookie('jid', '')
    return 'logout successfull'
  }
}