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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const errorHandler_1 = __importDefault(require("./errorHandler"));
class EmailSender {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    sendEmail(toAddress, subject, text, html) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USERNAME,
                    to: toAddress,
                    subject: subject,
                    text: text,
                    html: html,
                };
                yield this.transporter.sendMail(mailOptions);
                console.log('Email sent to:', mailOptions.to);
            }
            catch (error) {
                console.log(error);
                throw new errorHandler_1.default(error, 500);
            }
        });
    }
    sendWelcomeEmail(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailAddress = user.email;
            const username = user.username;
            const message = "Welcome to Scissors , your number one platform for short url. We are delighted to have you";
            const heading = 'Welcome';
            const templatePath = path_1.default.join(__dirname, '../views/email.ejs');
            const template = yield ejs_1.default.renderFile(templatePath, {
                message,
                username,
                heading,
            });
            return this.sendEmail(emailAddress, message, heading, template);
        });
    }
    sendPasswordResetEmail(user, resetToken, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeRemainingInMinutes = Math.max(0, Math.ceil((user.passwordResetTokenExpiryTime - Date.now()) / 60000));
            const username = user.firstName;
            const emailAddress = user.email;
            const subject = 'Password Reset';
            const text = `You have requested for a password reset Token. This token will be expiring in the next ${timeRemainingInMinutes} minutes.\nClick the link provided to reset your password`;
            const templatePath = path_1.default.join(__dirname, '../views/passwordToken.ejs');
            const htmlTemplate = yield ejs_1.default.renderFile(templatePath, {
                message: text,
                username,
                heading: subject,
                url,
                token: resetToken,
            });
            return this.sendEmail(emailAddress, subject, text, htmlTemplate);
        });
    }
}
exports.default = EmailSender;
//# sourceMappingURL=sendEmail.js.map