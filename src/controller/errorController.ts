import { Request, Response, NextFunction } from 'express';
import AppError from '../Utils/errorHandler';

const handleTokenExpire = () => {
  return new AppError('Kindly login again', 400);
};

const handleCastError = (err: any) => {
  const value = err.value;
  const message = `${value} is an Invalid Input`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err: any) => {
  const value = err.message.match(/(["'])(?:\\.|[^\\])*?\1/)[0].split('"')[1];
  const message = `${value} is already taken`;
  return new AppError(message, 400);
};

const handleValidatorError = (err: any) => {
  const message = err.message.split(':')[2].trim();
  return new AppError(message, 400);
};

const handleJwtError = (err: any) => {
  const message = err.message;
  return new AppError(message, 401);
};

const sendErrorDev = (error: any, res: Response) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error: any, res: Response) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };
    err.message = error.message;

    if (error.name === 'CastError') err = handleCastError(error);
    if (error.code === 11000) err = handleDuplicateFields(error);
    if (error.name === 'ValidationError') err = handleValidatorError(error);
    if (error.name === 'JsonWebTokenError') err = handleJwtError(error);
    if (error.name === 'TokenExpiredError') err = handleTokenExpire();

    sendErrorProd(err, res);
  }
  next();
};

export default errorHandler;
