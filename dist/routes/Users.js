"use strict";
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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_1 = require("express");
const constants_1 = require("@shared/constants");
const typeorm_1 = require("typeorm");
const User_1 = require("@entities/User");
const middleware_1 = require("./middleware");
const class_validator_1 = require("class-validator");
const router = express_1.Router();
const { BAD_REQUEST, CREATED, OK, NOT_FOUND, INTERNAL_SERVER_ERROR, } = http_status_codes_1.default;
/******************************************************************************
 *                      Get All Users - "GET /api/users"
 ******************************************************************************/
// router.get('/', adminMW, async (req: Request, res: Response) => {
router.get("/", middleware_1.adminMW, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield typeorm_1.getRepository(User_1.User).createQueryBuilder("user").paginate();
    return res.status(OK).json(data);
}));
router.get("/:id", middleware_1.adminMW, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield typeorm_1.getRepository(User_1.User).findOne(id);
    if (!user) {
        return res.status(NOT_FOUND).json({
            error: "Not Found",
        });
    }
    return res.status(OK).json(user);
}));
/******************************************************************************
 *                       Add One - "POST /api/users"
 ******************************************************************************/
router.post("/", middleware_1.adminMW, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User_1.User();
    const { username, email, password } = req.body;
    user.username = username;
    user.email = email;
    user.password = password;
    const errors = yield class_validator_1.validate(user, {
        groups: ["create"],
    });
    if (errors.length > 0) {
        return res.status(BAD_REQUEST).json(errors);
    }
    else {
        const response = yield typeorm_1.getRepository(User_1.User).save(user);
        return res.status(CREATED).json(response);
    }
}));
/******************************************************************************
 *                       Update - "PUT /api/users/:id"
 ******************************************************************************/
router.put("/:id", middleware_1.adminMW, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield typeorm_1.getRepository(User_1.User).findOne(id);
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    const { username, email, password } = req.body;
    user.username = username;
    user.email = email;
    user.password = password !== "" ? password : undefined;
    const errors = yield class_validator_1.validate(user, {
        groups: ["update"],
        skipMissingProperties: true,
    });
    if (errors.length > 0) {
        return res.status(BAD_REQUEST).json(errors);
    }
    else {
        yield typeorm_1.getRepository(User_1.User).save(user);
        const response = yield typeorm_1.getRepository(User_1.User).findOneOrFail(user.id);
        return res.status(OK).json(response);
    }
}));
/******************************************************************************
 *                    Delete - "DELETE /api/users/:id"
 ******************************************************************************/
router.delete("/:id", middleware_1.adminMW, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield typeorm_1.getRepository(User_1.User).findOne(id);
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    try {
        yield typeorm_1.getRepository(User_1.User).delete(id);
        return res.status(OK).end();
    }
    catch (e) {
        return res.status(INTERNAL_SERVER_ERROR).json(e);
    }
}));
/******************************************************************************
 *                                     Export
 ******************************************************************************/
exports.default = router;
