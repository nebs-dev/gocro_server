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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticatedMiddleware = void 0;
const JwtService_1 = require("src/services/JwtService");
const jwtService = new JwtService_1.JwtService();
const isAuthenticatedMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("HERE");
        // Get json-web-token
        const jwt = jwtService.extractToken(req);
        req.body = {};
        if (!jwt) {
            req.body.isAuth = false;
        }
        req.body.isAuth = true;
        next();
    }
    catch (err) {
        req.body.isAuth = false;
        next();
    }
});
exports.isAuthenticatedMiddleware = isAuthenticatedMiddleware;
