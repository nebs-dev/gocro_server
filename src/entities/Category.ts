import { IsNotEmpty, Length } from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Route } from "./Route";

export interface ICategory {
  id: number;
  title: string;
  routes?: Route[];
  created_at: Date;
  updated_at: Date;
}

@ObjectType()
@Entity("categories")
export class Category extends BaseEntity implements ICategory {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Route], { nullable: true })
  @ManyToMany(() => Route, (route: Route) => route.categories)
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
  title: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
