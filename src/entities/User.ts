import {Field, ObjectType} from 'type-graphql'
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity} from 'typeorm'

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
}
