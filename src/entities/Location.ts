import { IsNotEmpty, Length, MinLength, ValidateNested } from "class-validator";
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
import { Event } from "./Event";
import { Route } from "./Route";

export interface ILocation {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

@ObjectType()
@Entity("locations")
export class Location extends BaseEntity implements ILocation {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Route, (route) => route.location)
  routes: Route[];

  @Field(() => [Event])
  @OneToMany(() => Event, (event) => event.location)
  @ValidateNested()
  events: Event[];

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

  @Field(() => String)
  @Column("longtext")
  @MinLength(20)
  @IsNotEmpty({
    groups: ["create"],
  })
  description: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
