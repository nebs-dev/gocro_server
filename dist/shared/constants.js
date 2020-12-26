"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3_BUCKET_NAME = exports.S3_SECRET = exports.S3_ID = exports.cookieProps = exports.pwdSaltRounds = exports.internalServerErr = exports.loginFailedErr = exports.paramMissingError = void 0;
// Strings
exports.paramMissingError = 'One or more of the required parameters was missing.';
exports.loginFailedErr = 'Login failed';
exports.internalServerErr = 'Internal Server Error';
// Numbers
exports.pwdSaltRounds = 12;
// Cookie Properties
exports.cookieProps = Object.freeze({
    key: 'ExpressGeneratorTs',
    secret: process.env.COOKIE_SECRET,
    options: {
        httpOnly: true,
        signed: true,
        path: process.env.COOKIE_PATH,
        maxAge: Number(process.env.COOKIE_EXP),
        domain: process.env.COOKIE_DOMAIN,
        secure: process.env.SECURE_COOKIE === 'true',
    },
});
// Amazon S3
exports.S3_ID = process.env.S3_ID;
exports.S3_SECRET = process.env.S3_SECRET;
exports.S3_BUCKET_NAME = String(process.env.S3_BUCKET_NAME);
