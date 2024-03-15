"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRouter_1 = __importDefault(require("./route/userRouter"));
const authRoute_1 = __importDefault(require("./route/authRoute"));
const url_1 = __importDefault(require("./route/url"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
console.log(path_1.default.join(__dirname, 'views'));
const appLimiter = (0, express_rate_limit_1.default)({
    max: 100, // max allowable number of requests from an IP address in a given timeframe
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many requests from your IP address, please try again later.",
});
app.use("/", appLimiter); //Use to limit repeated requests to the server
app.use("/api/auth", authRoute_1.default);
app.use("/api/url", url_1.default);
app.use("/api/user", userRouter_1.default);
// app.get("/", (req: Request, res: Response) => {
//   res.send("Welcome to the homepage");
// });
exports.default = app;
//# sourceMappingURL=app.js.map