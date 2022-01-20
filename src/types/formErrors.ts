import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class FormFieldError {

  @Field()
    field: string

  @Field()
    message: string
}