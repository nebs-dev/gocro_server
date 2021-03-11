import { 
  IsDefined, 
  IsNotEmpty, 
  IsOptional, 
  Length,
} from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,  
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Route } from "./Route";

export interface IReview {
  id: number;
  title: string;
  text: string;
  rate: number;
  user: User;
  route: Route;
  created_at: Date;
  updated_at: Date;
}

export const reviewRelations = ["user", "route"];

@ObjectType()
@Entity("reviews")
export class Review extends BaseEntity implements IReview {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({
    length: 45,
    unique: true
  })
  @Length(4, 45, {
    always: true
  })
  @IsNotEmpty({
    groups: ["create"]
  })
  title: string;

  @Field(() => String)
  @Column("longtext")
  @IsOptional()
  text: string;

  @Field(() => Int)
  @Column("integer", { nullable: false })
  rate: number;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.reviews)
  @JoinColumn({ name: "user_id" })
  @IsDefined({ always: true })
  user: User;

  @Field(() => Route)
  @ManyToOne(() => Route, (route: Route) => route.reviews)
  @JoinColumn({ name: "route_id" })
  @IsDefined({ always: true })
  route: Route;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;  
}