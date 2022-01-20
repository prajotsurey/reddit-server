import {Field, ObjectType} from 'type-graphql'
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, ManyToOne, OneToMany} from 'typeorm'
import { Post } from './Post'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
    id: number

  @Field()
  @Column({ unique: true })
    email!: string

  @Column()
    passwordHash: string

  @Field()
  @CreateDateColumn()
    createdAt: string

  @Field(() => [Post])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany(_type => Post, post => post.creator)
    posts: User
}
