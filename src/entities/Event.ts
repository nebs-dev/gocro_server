import {
  IsDefined,
  IsNotEmpty,
  Length,
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
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./Category";
import { Location } from "./Location";
import { Price } from "./Price";

export interface IEvent {
  id: number;
  title: string;
  text: string;
  category: Category;
  location: Location;
  prices: Price[];
  created_at: Date;
  updated_at: Date;
}

@ObjectType()
@Entity("events")
export class Event extends BaseEntity implements IEvent {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.events)
  @JoinColumn({ name: "category_id" })
  @IsDefined({ always: true })
  @ValidateNested()
  category: Category;

  @Field(() => Location)
  @ManyToOne(() => Location, (location) => location.events)
  @JoinColumn({ name: "location_id" })
  @IsDefined({ always: true })
  @ValidateNested()
  location: Location;

  @Field(() => [Price])
  @OneToMany(() => Price, (price) => price.event)
  @ValidateNested()
  prices: Price[];

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
  text: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
