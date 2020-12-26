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
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = require("express");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const JwtService_1 = require("src/services/JwtService");
const constants_1 = require("@shared/constants");
const User_1 = require("@entities/User");
const typeorm_1 = require("typeorm");
const router = express_1.Router();
// const userDao = new UserDao();
const jwtService = new JwtService_1.JwtService();
const { BAD_REQUEST, OK, UNAUTHORIZED } = http_status_codes_1.default;
/******************************************************************************
 *                      Login User - "POST /api/auth/login"
 ******************************************************************************/
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check email and password present
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    // Fetch user
    const user = yield typeorm_1.getRepository(User_1.User).findOne({ email: email });
    if (!user) {
        return res.status(UNAUTHORIZED).json({
            error: constants_1.loginFailedErr,
        });
    }
    // Check password
    const pwdPassed = yield bcrypt_1.default.compare(password, user.password);
    if (!pwdPassed) {
        return res.status(UNAUTHORIZED).json({
            error: constants_1.loginFailedErr,
        });
    }
    // Setup Admin Cookie
    const jwt = yield jwtService.getJwt({
        id: user.id,
        role: user.role,
    });
    // Return
    return res.status(OK).json({
        token: jwt,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        },
    });
}));
/******************************************************************************
 *                                 Export Router
 ******************************************************************************/
exports.default = router;
