import { Field, Int, ObjectType } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne } from 'typeorm'
import { User } from './User'

@ObjectType()
@Entity()
export class Post extends BaseEntity{

  @Field()
  @PrimaryGeneratedColumn()
    id: number

  @Field()
  @Column()
    title: string

  @Field()
  @Column()
    content: string

  @Field()
  @CreateDateColumn()
    createdAt: number

  @Field(() => Int, { nullable: true })
  @UpdateDateColumn()
    updatedAt?: number

  @Field(() => User)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(_type => User, user => user.posts)
    creator: User

}