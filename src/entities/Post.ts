import { Field, Int, ObjectType } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, OneToMany } from 'typeorm'
import { Vote } from './Vote'
import { User } from './User'
import { IsInt, Max, Min } from 'class-validator'

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

  @Field(() => Date)
  @CreateDateColumn()
    createdAt: Date

  @Field(() => Int, { nullable: true })
  @UpdateDateColumn()
    updatedAt?: Date

  @Field()
  @Column()
    creatorId!: number

  @Field(() => User)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(_type => User, user => user.posts, {onDelete: 'CASCADE'})
    creator: User

  @Field(() => [Vote], {nullable: true})
  @OneToMany(_type => Vote, vote => vote.post)
    votes: Vote[]

  @Field()
  @Column({default: 0})
    voteCount: number

  @Field()
  @IsInt()
  @Min(-1)
  @Max(1)
    voteStatus: number

}