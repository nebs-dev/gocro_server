import { IsOptional } from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Route } from "./Route";

export interface ITehnicalInfo {
  id: bigint;
  elevation_min: bigint;
  elevation_max: bigint;
  length: bigint;
  duration: bigint;
  created_at: Date;
  updated_at: Date;
}

@ObjectType()
@Entity("tehnical_info")
export class TehnicalInfo extends BaseEntity implements ITehnicalInfo {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: bigint;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  elevation_min: bigint;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  elevation_max: bigint;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  length: bigint;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  duration: bigint;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
