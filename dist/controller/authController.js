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
exports.signInUser = exports.signUpUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authModel_1 = __importDefault(require("../model/authModel"));
const genToken_1 = __importDefault(require("../Utils/genToken"));
const sendEmail_1 = __importDefault(require("../Utils/sendEmail"));
const errorHandler_1 = __importDefault(require("../Utils/errorHandler"));
const signUpUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        const user = yield authModel_1.default.create({
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        });
        if (!user)
            return next(new errorHandler_1.default("Bad request! try again later.", 400));
        const token = (0, genToken_1.default)(user._id);
        const mail = new sendEmail_1.default();
        yield mail.sendWelcomeEmail(user);
        res.status(201).json({
            status: 'success',
            message: "Signup successful!",
            token,
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(new errorHandler_1.default(error, 500));
    }
});
exports.signUpUser = signUpUser;
const signInUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandler_1.default('Bad request! Email and Password are required.', 400));
        }
        const user = yield authModel_1.default.findOne({ email }).select('+password');
        if (!user) {
            return next(new errorHandler_1.default('No user was found.', 404));
        }
        const isValid = yield user.isCorrectPassword(password);
        if (!isValid)
            return next(new errorHandler_1.default("invalid password or email", 401));
        const token = (0, genToken_1.default)(user._id);
        res.status(200).json({
            status: 'success',
            message: "Signin successful!",
            token,
            data: {
                user,
            },
        });
        if (!user)
            return next(new errorHandler_1.default("Bad request! try again later.", 400));
    }
    catch (error) {
        next(new errorHandler_1.default(error, 500));
    }
});
exports.signInUser = signInUser;
//# sourceMappingURL=authController.js.map