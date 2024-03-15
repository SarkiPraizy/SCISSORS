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
exports.deleteUrl = exports.generateQrCode = exports.redirectUrl = exports.costumUrl = exports.shortenUrl = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const crypto_1 = __importDefault(require("crypto"));
const UserUrl_1 = __importDefault(require("../model/UserUrl"));
const qrcode_1 = __importDefault(require("qrcode"));
const shortenUrl = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInput = req.body;
        userInput.shortId = crypto_1.default.randomBytes(Math.ceil(1 / 2)).toString('hex').slice(0, 10);
        const newUrl = `${req.protocol}://${req.get('host')}/api/url/${userInput.shortId}`;
        userInput.newUrl = newUrl;
        userInput.user_id = req.user._id;
        console.log(userInput.user_id);
        console.log(req.user);
        const shortenedUrl = yield UserUrl_1.default.create(userInput);
        res.status(201).json({ status: 'Sucess', message: 'Created Successfully', data: shortenedUrl });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});
exports.shortenUrl = shortenUrl;
const costumUrl = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUrl = yield UserUrl_1.default.findOne({ shortId: req.params.urlId, user_id: req.user._id });
        console.log(existingUrl);
        if (!existingUrl || existingUrl === null)
            throw new Error('Not found');
        if ((existingUrl === null || existingUrl === void 0 ? void 0 : existingUrl.user_id.toString()) === req.user._id.toString()) {
            existingUrl.shortId = req.body ? req.body.shortId : existingUrl === null || existingUrl === void 0 ? void 0 : existingUrl.shortId;
            existingUrl.newUrl = `${req.protocol}://${req.get('host')}/api/url/${existingUrl.shortId}`;
            yield existingUrl.save();
            res.status(201).json({ status: 'Success', message: 'Updated Sucessfully', data: existingUrl });
        }
        else {
            new Error('This user is not authorized');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});
exports.costumUrl = costumUrl;
const redirectUrl = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let url = yield UserUrl_1.default.findOne({ shortId: req.params.urlId });
        console.log(req.params.urlId);
        console.log(url);
        if (!url)
            new Error("no Url was found");
        if (url)
            url.clicks = url.clicks + 1;
        res.status(302).redirect(url.origUrl);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('input a valid url');
    }
});
exports.redirectUrl = redirectUrl;
const generateQrCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortUrl = req.body.shortUrl;
        console.log(shortUrl);
        const qrCodeData = yield qrcode_1.default.toDataURL(shortUrl);
        res.render('image', { qrCode: qrCodeData });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error generating QR code');
    }
});
exports.generateQrCode = generateQrCode;
const deleteUrl = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUrl = yield UserUrl_1.default.findOne({ shortId: req.params.urlId, user_id: req.user._id });
        console.log(existingUrl);
        console.log(req.user);
        if (!existingUrl || existingUrl === null)
            throw new Error('Url not found');
        if ((existingUrl === null || existingUrl === void 0 ? void 0 : existingUrl.user_id.toString()) === req.user._id.toString()) {
            existingUrl.shortId = req.body ? req.body.shortId : existingUrl === null || existingUrl === void 0 ? void 0 : existingUrl.shortId;
            existingUrl.newUrl = `${req.protocol}://${req.get('host')}/api/url/${existingUrl.shortId}`;
            yield existingUrl.save();
            res.status(201).json({ status: 'Success', message: 'You have deleted this Url', data: existingUrl });
        }
        else {
            new Error('This user is not authorized');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});
exports.deleteUrl = deleteUrl;
//# sourceMappingURL=urlController.js.map