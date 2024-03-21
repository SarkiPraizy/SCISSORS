"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = __importDefault(require("../Utils/errorHandler"));
const handleTokenExpire = () => {
    return new errorHandler_1.default('Kindly login again', 400);
};
const handleCastError = (err) => {
    const value = err.value;
    const message = `${value} is an Invalid Input`;
    return new errorHandler_1.default(message, 400);
};
const handleDuplicateFields = (err) => {
    const value = err.message.match(/(["'])(?:\\.|[^\\])*?\1/)[0].split('"')[1];
    const message = `${value} is already taken`;
    return new errorHandler_1.default(message, 400);
};
const handleValidatorError = (err) => {
    const message = err.message.split(':')[2].trim();
    return new errorHandler_1.default(message, 400);
};
const handleJwtError = (err) => {
    const message = err.message;
    return new errorHandler_1.default(message, 401);
};
const sendErrorDev = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stack: error.stack,
    });
};
const sendErrorProd = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
    else {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong. Please try again later.',
        });
    }
};
const errorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let err = Object.assign({}, error);
        err.message = error.message;
        if (error.name === 'CastError')
            err = handleCastError(error);
        if (error.code === 11000)
            err = handleDuplicateFields(error);
        if (error.name === 'ValidationError')
            err = handleValidatorError(error);
        if (error.name === 'JsonWebTokenError')
            err = handleJwtError(error);
        if (error.name === 'TokenExpiredError')
            err = handleTokenExpire();
        sendErrorProd(err, res);
    }
    next();
};
exports.default = errorHandler;
//# sourceMappingURL=errorController.js.map