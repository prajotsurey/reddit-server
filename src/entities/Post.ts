import { Field, Int, ObjectType } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm'

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

}