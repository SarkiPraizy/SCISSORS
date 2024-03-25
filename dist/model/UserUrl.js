"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userUrlSchema = new mongoose_1.Schema({
    origUrl: { type: String, required: true },
    shortId: { type: String },
    newUrl: { type: String },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        // required: [true, "Please provide the blog author's Id."],
        ref: "userAuth",
    },
    clicks: { type: Number, required: true, default: 0 },
    date: { type: String, default: Date.now().toString() },
});
const UserUrl = (0, mongoose_1.model)("userUrl", userUrlSchema);
exports.default = UserUrl;
//# sourceMappingURL=UserUrl.js.map