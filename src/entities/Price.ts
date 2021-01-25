import {
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidateNested,
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

import { Route } from "./Route";
import { IsHigherThan } from "@shared/decorators";

export interface IPrice {
  id: bigint;
  amount: number;
  from: Date;
  to: Date;
  people_min: bigint;
  people_max: bigint;
  route: Route;
  created_at: Date;
  updated_at: Date;
}

@ObjectType()
@Entity("prices")
export class Price extends BaseEntity implements IPrice {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: bigint;

  @Field(() => Route)
  @ManyToOne(() => Route, (route) => route.prices)
  @JoinColumn({ name: "route_id" })
  @ValidateNested()
  route: Route;

  @Field(() => Number)
  @Column("decimal", { precision: 6, scale: 2 })
  @IsNotEmpty({
    groups: ["create"],
  })
  amount: number;

  @Field(() => Date, { nullable: true })
  @Column("datetime", { nullable: true })
  @IsOptional()
  from: Date;

  @Field(() => Date, { nullable: true })
  @Column("datetime", { nullable: true })
  @IsOptional()
  to: Date;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @ValidateIf((o) => o.people_max)
  @IsNotEmpty()
  people_min: bigint;

  @Field(() => Int)
  @Column("integer")
  @IsHigherThan("people_min", {
    message: "People_max must be higher than the people_min",
  })
  people_max: bigint;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
