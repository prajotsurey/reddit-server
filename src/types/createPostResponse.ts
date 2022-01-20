import { ObjectType, Field } from 'type-graphql'
import { FormFieldError } from './formErrors'
import { Post } from '../entities/Post'

@ObjectType()
export class createPostResponse{

  @Field(() => Post, {nullable:true})
    post?: Post

  @Field(() => [FormFieldError], {nullable:true})
    errors?: FormFieldError[]
}