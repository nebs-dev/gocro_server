import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./Category";
import { Client } from "./Client";
import { Day } from "./Day";
import { GuidedInfo } from "./GuidedInfo";
import { Location } from "./Location";
import { Price } from "./Price";
import { TehnicalInfo } from "./TehnicalInfo";

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
  categories: Category[];
  client: Client;
  days: Day[];
  prices: Price[];
  created_at: Date;
  updated_at: Date;
}

export const routeRelations = [
  "location",
  "categories",
  "client",
  "days",
  "days.tehnical_info",
  "tehnical_info",
  "guided_info",
];

@ObjectType()
@Entity("routes")
export class Route extends BaseEntity implements IRoute {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Location)
  @ManyToOne(() => Location, (location) => location.routes)
  @JoinColumn({ name: "location_id" })
  @IsNotEmpty({
    groups: ["create"],
  })
  @ValidateNested()
  location: Location;

  @Field(() => [Category], { nullable: true })
  @ManyToMany(() => Category, (category: Category) => category.routes)
  @JoinTable({
    name: "category_route",
    joinColumn: {
      name: "route_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
  })
  categories: Category[];

  @Field(() => Client)
  @ManyToOne(() => Client, (client) => client.routes)
  @JoinColumn({ name: "client_id" })
  @ValidateNested()
  client: Client;

  @Field(() => [Day])
  @OneToMany(() => Day, (day) => day.route)
  @ValidateNested()
  days: Day[];

  @Field(() => [Price])
  @OneToMany(() => Price, (price) => price.route)
  @ValidateNested()
  prices: Price[];

  @Field(() => TehnicalInfo, { nullable: true })
  @OneToOne(() => TehnicalInfo)
  @JoinColumn({ name: "tehnical_info_id" })
  tehnical_info: TehnicalInfo;

  @Field(() => GuidedInfo, { nullable: true })
  @OneToOne(() => GuidedInfo, (guided_info) => guided_info.route, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "guided_info_id" })
  guided_info: GuidedInfo;

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
  @MinLength(20, { always: true })
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

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
