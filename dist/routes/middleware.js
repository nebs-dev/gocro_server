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
exports.authMW = exports.adminMW = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const User_1 = require("@entities/User");
const JwtService_1 = require("src/services/JwtService");
const jwtService = new JwtService_1.JwtService();
const { UNAUTHORIZED } = http_status_codes_1.default;
// Middleware to verify if user is an admin
const adminMW = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get json-web-token
        const jwt = jwtService.extractToken(req);
        if (!jwt) {
            throw Error("JWT not present in the request.");
        }
        // Make sure user role is an admin
        const clientData = yield jwtService.decodeJwt(jwt);
        if (clientData.role === User_1.UserRoles.Admin) {
            res.locals.userId = clientData.id;
            next();
        }
        else {
            throw Error("Access denied.");
        }
    }
    catch (err) {
        return res.status(UNAUTHORIZED).json({
            error: err.message,
        });
    }
});
exports.adminMW = adminMW;
const authMW = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get json-web-token
        const jwt = jwtService.extractToken(req);
        if (!jwt) {
            throw Error("JWT not present in the request.");
        }
        next();
    }
    catch (err) {
        return res.status(UNAUTHORIZED).json({
            error: err.message,
        });
    }
});
exports.authMW = authMW;
