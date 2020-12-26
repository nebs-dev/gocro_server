import { IsNotEmpty, Length, Max, MinLength } from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export interface IRoute {
  id: number;
  title: string;
  description: string;
  details: string;
  average_rate: number;
  fitness_level: number;
  experience: number;
  note: string;
  active: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

@ObjectType()
@Entity()
export class Route extends BaseEntity implements IRoute {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

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
  @Column({
    length: 100,
  })
  @Length(4, 100, {
    always: true,
  })
  @IsNotEmpty({
    groups: ["create"],
  })
  description: string;

  @Field(() => String)
  @Column("longtext")
  @MinLength(20)
  @IsNotEmpty({
    groups: ["create"],
  })
  details: string;

  @Field(() => Number)
  @Column("decimal", { precision: 2, scale: 2, nullable: true })
  @Max(10)
  average_rate: number;

  @Field(() => Int)
  @Column("integer", { nullable: true })
  @Max(5)
  fitness_level: number;

  @Field(() => Int)
  @Column("integer", { nullable: true })
  @Max(5)
  experience: number;

  @Field(() => String)
  @Column("longtext", { nullable: true })
  note: string;

  @Field(() => Boolean)
  @Column("tinyint", { default: 1 })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
