"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const config_1 = require("./config");
const app_1 = __importDefault(require("./app"));
const PORT = 7070;
const HOSTNAME = '0.0.0.0';
console.log(process.env.NODE_ENV);
// Connect to the database when the application starts
(0, config_1.mongoDbConnection)();
app_1.default.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map