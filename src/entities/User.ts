import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  BeforeInsert,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Length, IsEmail, IsNotEmpty, ValidateNested } from "class-validator";
import { pwdSaltRounds } from "@shared/constants";
import bcrypt from "bcrypt";
import { Field, Int, ObjectType } from "type-graphql";
import { Review } from "./Review";

export enum UserRoles {
  Admin = 1,
  Standard = 2,
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRoles;
  active: Boolean;
  reviews: Review[];
  created_at: Date;
  updated_at: Date;
}

@ObjectType()
@Entity("users")
export class User extends BaseEntity implements IUser {
  @BeforeUpdate()
  async hashPassword() {
    if (this.password !== undefined && this.password !== "") {
      this.password = await bcrypt.hash(this.password, pwdSaltRounds);
    }
  }

  @BeforeInsert()
  async hashInsertPassword() {
    if (this.password !== undefined) {
      this.password = await bcrypt.hash(this.password, pwdSaltRounds);
    }
  }

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({
    length: 100,
    unique: true,
  })
  @Length(4, 100, {
    always: true,
  })
  @IsNotEmpty({
    groups: ["create"],
  })
  username: string;

  @Field(() => String)
  @Column({
    length: 100,
    unique: true,
  })
  @IsEmail(undefined, {
    always: true,
  })
  @IsNotEmpty({
    groups: ["create"],
  })
  email: string;

  @Field(() => Int)
  @Column({ default: 2 })
  role: number;

  @Column()
  @IsNotEmpty({
    groups: ["create"],
  })
  @Length(6, 100, {
    always: true,
  })
  password: string;

  @Field(() => Boolean)
  @Column("tinyint", { default: 0 })
  active: boolean;

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.user)
  @ValidateNested()
  reviews: Review[];

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
