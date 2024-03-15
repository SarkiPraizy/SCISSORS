"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function genToken(user) {
    const payload = { user };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || "", {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
    return token;
}
exports.default = genToken;
//# sourceMappingURL=genToken.js.map