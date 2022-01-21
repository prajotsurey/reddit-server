import { Field, ObjectType } from 'type-graphql'
import {Entity, Column, CreateDateColumn, PrimaryColumn, ManyToOne, BaseEntity} from 'typeorm'
import { Post } from './Post'
import { User } from './User'

@ObjectType()
@Entity()
export class Vote extends BaseEntity{

  @Field()
  @PrimaryColumn()
    userId: number

  @Field()
  @Column()
    value: number

  @Field(() => User)
  @ManyToOne(_type => User, user => user.votes,{onDelete: 'CASCADE'})
    user: User

  @Field()
  @PrimaryColumn()
    postId: number

  @Field(() => Post)
  @ManyToOne(_type => Post, post => post.votes,{onDelete: 'CASCADE'})
    post: Post

  @Field()
  @CreateDateColumn()
    createdAt: Date
}