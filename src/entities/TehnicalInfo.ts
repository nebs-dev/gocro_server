import { IsOptional } from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Day } from "./Day";
import { Route } from "./Route";

export interface ITehnicalInfo {
  id: bigint;
  elevation_min: number;
  elevation_max: number;
  length: number;
  duration: number;
  day: Day;
  route: Route;
  created_at: Date;
  updated_at: Date;
}

export const tehnicalInfoRelations = ["route, day"];

@ObjectType()
@Entity("tehnical_info")
export class TehnicalInfo extends BaseEntity implements ITehnicalInfo {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: bigint;

  @OneToOne(() => Route, (route) => route.tehnical_info, {
    onDelete: "CASCADE",
  })
  route: Route;

  @OneToOne(() => Day, (day) => day.tehnical_info, {
    onDelete: "CASCADE",
  })
  day: Day;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  elevation_min: number;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  elevation_max: number;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  length: number;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  duration: number;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
