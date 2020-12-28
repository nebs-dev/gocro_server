import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Route } from "./Route";

export interface IClient {
  id: number;
  name: string;
  email: string;
  address: string;
  routes?: Route[];
  created_at: Date;
  updated_at: Date;
}

@ObjectType()
@Entity("clients")
export class Client extends BaseEntity implements IClient {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Route], { nullable: true })
  @OneToMany(() => Route, (route: Route) => route.client)
  routes: Route[];

  @Field(() => String)
  @Column({
    length: 45,
    unique: true,
  })
  @Length(4, 45, {
    always: true,
  })
  @IsNotEmpty({
    groups: ["create"],
  })
  name: string;

  @Field(() => String)
  @Column({
    length: 100,
    unique: true,
  })
  @IsEmail(undefined, {
    always: true,
  })
  @IsNotEmpty({
    groups: ["create"],
  })
  email: string;

  @Field(() => String)
  @Column({
    length: 255,
  })
  @Length(4, 255, {
    always: true,
  })
  @IsNotEmpty({
    groups: ["create"],
  })
  address: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
