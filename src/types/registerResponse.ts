import { User } from '../entities/User'
import { ObjectType, Field } from 'type-graphql'
import { FormError } from './formError'

@ObjectType()
export class registerResponse{

  @Field(() => User, {nullable:true})
    user?: User

  @Field(() => [FormError], {nullable:true})
    errors?: FormError[]
}