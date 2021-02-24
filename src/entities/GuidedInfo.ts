import { IsOptional, Length, MinLength } from "class-validator";
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
import { Route } from "./Route";

export interface IGuidedInfo {
  id: number;
  age_min: number;
  age_max: number;
  starts_from: string;
  people_min: number;
  people_max: number;
  accommodation: string;
  meals: string;
  transfer: string;
  equipment: string;
  insurance: string;
  availability_from: string;
  availability_to: string;
  discount: string;
  cancelation_policy: string;
  not_include: string;
  additional_charge: string;
  created_at: Date;
  updated_at: Date;
}

@ObjectType()
@Entity()
export class GuidedInfo extends BaseEntity implements IGuidedInfo {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Route, (route) => route.guided_info, {
    onDelete: "CASCADE",
  })
  route: Route;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  age_min: number;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  age_max: number;

  @Field(() => String)
  @Column({
    length: 255,
  })
  @Length(3, 255, {
    always: true,
  })
  starts_from: string;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  people_min: number;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  people_max: number;

  @Field(() => String, { nullable: true })
  @Column("longtext", { nullable: true })
  @MinLength(10)
  accommodation: string;

  @Field(() => String, { nullable: true })
  @Column("longtext", { nullable: true })
  @MinLength(10)
  meals: string;

  @Field(() => String, { nullable: true })
  @Column("longtext", { nullable: true })
  @MinLength(10)
  transfer: string;

  @Field(() => String, { nullable: true })
  @Column("longtext", { nullable: true })
  @MinLength(10)
  equipment: string;

  @Field(() => String, { nullable: true })
  @Column("longtext", { nullable: true })
  @MinLength(10)
  insurance: string;

  @Field(() => String, { nullable: true })
  @Column({
    length: 255,
    nullable: true,
  })
  @Length(3, 255, {
    always: true,
  })
  availability_from: string;

  @Field(() => String, { nullable: true })
  @Column({
    length: 255,
    nullable: true,
  })
  @Length(3, 255, {
    always: true,
  })
  availability_to: string;

  @Field(() => String, { nullable: true })
  @Column("longtext", { nullable: true })
  @MinLength(10)
  discount: string;

  @Field(() => String, { nullable: true })
  @Column("longtext", { nullable: true })
  @MinLength(10)
  cancelation_policy: string;

  @Field(() => String, { nullable: true })
  @Column("longtext", { nullable: true })
  @MinLength(10)
  not_include: string;

  @Field(() => String, { nullable: true })
  @Column("longtext", { nullable: true })
  @MinLength(10)
  additional_charge: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
