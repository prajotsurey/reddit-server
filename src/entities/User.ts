import {Field, ObjectType} from 'type-graphql'
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, OneToMany} from 'typeorm'
import { Vote } from './Vote'
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
  @OneToMany(_type => Post, post => post.creator, {onDelete: 'CASCADE'})
    posts: User

  @Field(() => [Vote], {nullable: true})
  @OneToMany(_type => Vote, vote => vote.user, {onDelete:'CASCADE'})
    votes: Vote[]
  
}
