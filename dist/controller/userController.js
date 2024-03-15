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
exports.reactivateAccount = exports.resetPassword = exports.forgetPassword = exports.logout = exports.updateUser = exports.deleteUser = void 0;
const errorHandler_1 = __importDefault(require("../Utils/errorHandler"));
const sendEmail_1 = __importDefault(require("../Utils/sendEmail"));
const sendResponse_1 = __importDefault(require("../Utils/sendResponse"));
const UserUrl_1 = __importDefault(require("../model/UserUrl"));
const authModel_1 = __importDefault(require("../model/authModel"));
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateDetails = req.body;
        console.log(req.user);
        if (!updateDetails)
            return;
        const newUpdate = yield authModel_1.default.findByIdAndUpdate(req.user._id, updateDetails, {
            new: true,
            runValidators: true,
        });
        console.log(newUpdate);
        if (!newUpdate)
            return next(new Error("Bad request! try again later."));
        res.status(201).json({
            status: 'success',
            message: "update successful!",
            data: {
                newUpdate
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const user = yield authModel_1.default.findByIdAndDelete({ _id: userId });
        if (!user)
            throw new Error("This user does not exist");
        res.json({ status: true, message: "User deleted" });
    }
    catch (error) {
        res.status(401).json({ message: 'user deletion failed', error });
    }
});
exports.deleteUser = deleteUser;
const logout = (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
    });
    res.status(200).json({ message: "You are logged out" });
};
exports.logout = logout;
function forgetPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield authModel_1.default
                .findOne({ email: req.body.email })
                .select("-password");
            if (!user)
                return next(new errorHandler_1.default("This user does not exist", 404));
            const resetToken = yield user.genResetToken();
            console.log(resetToken);
            const url = `${req.protocol}://${req.get("host")}/resetPassword/${resetToken}`;
            const sendMail = new sendEmail_1.default();
            yield sendMail.sendPasswordResetEmail(user, resetToken, url);
            res.status(200).json({
                message: "Your password reset token has been sent. Check your mailbox",
            });
        }
        catch (err) {
            new errorHandler_1.default('Password reset failed', 500);
        }
    });
}
exports.forgetPassword = forgetPassword;
function resetPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resetToken = req.params.Token;
            const user = yield authModel_1.default
                .findOne({
                resetPasswordToken: resetToken,
                resetTimeExp: { $gt: Date.now() },
            })
                .select("-password");
            if (!user)
                return next(new errorHandler_1.default("Invalid token or expired token", 404));
            user.password = req.body.password;
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpiryTime = undefined;
            yield user.save();
            // const token = await genToken(user._id);
            // res.cookie("jwt", token, { httpOnly: true });
            res
                .status(200)
                .json({ message: "A new password has been set", user });
        }
        catch (err) {
            new errorHandler_1.default('Password reset failed', 500);
        }
    });
}
exports.resetPassword = resetPassword;
function reactivateAccount(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sendResponse = new sendResponse_1.default(res);
        try {
            const user = yield UserUrl_1.default
                .findOne({ email: req.body.email })
                .select("-password");
            if (!user)
                next(new errorHandler_1.default("This user does not exist", 404));
            user.active = true;
            yield user.save();
            sendResponse.sendJson(user, `Welcome back ${user.username}. Your account has been re-activated`, 200);
        }
        catch (err) {
            new errorHandler_1.default(err, 500);
        }
    });
}
exports.reactivateAccount = reactivateAccount;
//# sourceMappingURL=userController.js.map