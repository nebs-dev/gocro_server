import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Length, IsNotEmpty, IsDefined } from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

export interface IUserToken {
  id: number;
  refresh_token: string;
  user: User;
  expires_at: Date;
  created_at: Date;
}

@ObjectType()
@Entity("user_token")
export class UserToken extends BaseEntity implements IUserToken {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  refresh_token: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  @IsDefined({ always: true })
  user: User;

  @Field(() => Date)
  @Column("datetime", { nullable: false })
  expires_at: Date;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;
}
