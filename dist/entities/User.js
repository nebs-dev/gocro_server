"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRoles = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const constants_1 = require("@shared/constants");
const bcrypt_1 = __importDefault(require("bcrypt"));
const type_graphql_1 = require("type-graphql");
var UserRoles;
(function (UserRoles) {
    UserRoles[UserRoles["Admin"] = 1] = "Admin";
    UserRoles[UserRoles["Standard"] = 2] = "Standard";
})(UserRoles = exports.UserRoles || (exports.UserRoles = {}));
let User = class User extends typeorm_1.BaseEntity {
    hashPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.password !== undefined && this.password !== "") {
                this.password = yield bcrypt_1.default.hash(this.password, constants_1.pwdSaltRounds);
            }
        });
    }
    hashInsertPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.password !== undefined) {
                this.password = yield bcrypt_1.default.hash(this.password, constants_1.pwdSaltRounds);
            }
        });
    }
};
__decorate([
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashInsertPassword", null);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        length: 100,
        unique: true,
    }),
    class_validator_1.Length(4, 100, {
        always: true,
    }),
    class_validator_1.IsNotEmpty({
        groups: ["create"],
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        length: 100,
        unique: true,
    }),
    class_validator_1.IsEmail(),
    class_validator_1.IsNotEmpty({
        groups: ["create"],
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.Column({ default: 2 }),
    __metadata("design:type", Number)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.IsNotEmpty({
        groups: ["create"],
    }),
    class_validator_1.Length(6, 100, {
        always: true,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
User = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], User);
exports.User = User;
