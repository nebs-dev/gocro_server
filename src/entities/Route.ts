import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  MinLength,
  ValidateNested,
} from "class-validator";
import { cpuUsage } from "process";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Location } from "./Location";

export interface IRoute {
  id: number;
  title: string;
  description: string;
  details: string;
  average_rate: number;
  fitness_level: bigint;
  experience: bigint;
  note: string;
  active: Boolean;
  location: Location;
  createdAt: Date;
  updatedAt: Date;
}

@ObjectType()
@Entity()
export class Route extends BaseEntity implements IRoute {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Location)
  @ManyToOne(() => Location, (location) => location.routes)
  @IsDefined({ always: true })
  @ValidateNested()
  location: Location;

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

  @Field(() => Number, { nullable: true })
  @Column("decimal", { precision: 2, scale: 2, nullable: true })
  @Max(10, { always: true })
  @IsOptional()
  average_rate: number;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  @Max(5, { always: true })
  fitness_level: bigint;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  @IsOptional()
  @Max(5, { always: true })
  experience: bigint;

  @Field(() => String, { nullable: true })
  @Column("longtext", { nullable: true })
  @IsOptional()
  note: string;

  @Column("tinyint", { default: 1 })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
