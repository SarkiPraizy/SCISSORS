"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const urlController_1 = require("../controller/urlController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
dotenv_1.default.config();
const UrlRouter = express_1.default.Router();
// Short URL generator
UrlRouter.post('/short', authMiddleware_1.isAuthenticated, urlController_1.shortenUrl);
UrlRouter.patch('/:urlId', authMiddleware_1.isAuthenticated, urlController_1.costumUrl);
UrlRouter.get('/:urlId', urlController_1.redirectUrl);
UrlRouter.post('/qrCode', authMiddleware_1.isAuthenticated, urlController_1.generateQrCode);
UrlRouter.delete('/deleteUrl/:urlId', authMiddleware_1.isAuthenticated, urlController_1.deleteUrl);
exports.default = UrlRouter;
//# sourceMappingURL=url.js.map