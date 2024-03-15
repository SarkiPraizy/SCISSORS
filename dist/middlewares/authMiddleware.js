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
exports.isLoggedIn = exports.isAuthenticated = void 0;
const authModel_1 = __importDefault(require("../model/authModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserUrl_1 = __importDefault(require("../model/UserUrl"));
const errorHandler_1 = __importDefault(require("../Utils/errorHandler"));
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        let token;
        if (authHeader) {
            token = authHeader.split(' ')[1];
        }
        else if (req.cookies) {
            token = req.cookies.jwt;
        }
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decodedToken = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);
        const currentTime = Math.floor(Date.now() / 1000);
        ;
        const user = yield authModel_1.default.findById(decodedToken.user);
        if (user && decodedToken.iat < currentTime) {
            req.user = user;
            res.locals.user = user;
            next();
        }
        else {
            return res.status(401).json({ message: 'Not authorized' });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.isAuthenticated = isAuthenticated;
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.cookies.jwt) {
            return next(new errorHandler_1.default('kindly login or sign up', 401));
        }
        else if (req.cookies.jwt) {
            const decodedToken = jsonwebtoken_1.default.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
            const currentTime = Math.floor(Date.now() / 1000);
            const user = yield UserUrl_1.default.findById(decodedToken.id);
            if (user && decodedToken.iat < currentTime)
                res.locals.user = user;
            return next();
        }
        next();
    }
    catch (err) {
        next(new errorHandler_1.default(err, 500));
    }
});
exports.isLoggedIn = isLoggedIn;
//# sourceMappingURL=authMiddleware.js.map