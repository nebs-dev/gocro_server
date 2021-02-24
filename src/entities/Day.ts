import { IsDefined, IsNotEmpty, Length, MinLength } from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Route } from "./Route";
import { TehnicalInfo } from "./TehnicalInfo";

export interface IDay {
  id: number;
  title: string;
  text: string;
  route: Route;
  tehnical_info: TehnicalInfo;
  created_at: Date;
  updated_at: Date;
}

@ObjectType()
@Entity("days")
export class Day extends BaseEntity implements IDay {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Route)
  @ManyToOne(() => Route, (route: Route) => route.days)
  @JoinColumn({ name: "route_id" })
  @IsDefined({ always: true })
  route: Route;

  @Field(() => TehnicalInfo, { nullable: true })
  @OneToOne(() => TehnicalInfo)
  @JoinColumn({ name: "tehnical_info_id" })
  tehnical_info: TehnicalInfo;

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
