"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const mongoose_1 = __importStar(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your firstname.'],
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your lastname.'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email address.'],
        unique: true,
        validate: [validator_1.default.isEmail, 'Please provide a valid email address.'],
    },
    password: {
        type: String,
        required: [
            true,
            "It's a dangerous world online! Please provide a password.",
        ],
        minLength: 6,
        select: false, // doesn't add this field on Read query
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        minLength: 6,
        select: false,
    },
    passwordModifiedAt: { type: Date },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    passwordResetToken: { type: String },
    passwordResetTokenExpiryTime: Date,
});
// Pre document hook for hashing password before save
authSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next(); // prevents hashing of unmodified password
        // Hashes the password of the currently processed document
        const hashedPassword = yield bcrypt_1.default.hash(this.password, 12);
        // Overwrite plain text password with hash
        this.password = hashedPassword;
        // Clear the confirm password field
        this.confirmPassword = undefined;
        next();
    });
});
// Pre document hook to update the passwordModifiedAt field after password change
authSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password') || this.isNew)
            return next(); // prevents update of passwordModifiedAt field for unmodified password or new document
        this.passwordModifiedAt = Date.now() - 1500; // Setting it to 1.5s in the past to prevent token invalidation issues
        next();
    });
});
// document method for checking correct password
authSchema.methods.isCorrectPassword = function (providedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(providedPassword, this.password);
    });
};
// document method for checking if password has been modified after token was issued
authSchema.methods.passwordModified = function (JWT_IAT) {
    if (!this.passwordModifiedAt)
        return false;
    const JWT_IAT_TS = new Date(JWT_IAT * 1000).toISOString();
    return new Date(JWT_IAT_TS) < new Date(this.passwordModifiedAt);
};
// document method for generating reset Token
authSchema.methods.genResetToken = function () {
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    this.passwordResetToken = hashedToken;
    this.passwordResetTokenExpiryTime = Date.now() + 10 * 60 * 1000;
    return token;
};
const Auth = mongoose_1.default.model('userAuth', authSchema);
exports.default = Auth;
//# sourceMappingURL=authModel.js.map