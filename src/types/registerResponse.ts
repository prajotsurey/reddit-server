import { User } from '../entities/User'
import { ObjectType, Field } from 'type-graphql'
import { FormFieldError } from './formErrors'

@ObjectType()
export class registerResponse{

  @Field(() => User, {nullable:true})
    user?: User

  @Field(() => [FormFieldError], {nullable:true})
    errors?: FormFieldError[]
}