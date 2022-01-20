import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class FormError {

  @Field()
    field: string

  @Field()
    message: string
}