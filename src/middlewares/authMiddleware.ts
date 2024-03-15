import Auth from "../model/authModel";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UserUrl from "../model/UserUrl";
import AppError from "../Utils/errorHandler";

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        let token;

        if (authHeader) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decodedToken:any = await jwt.verify(token, process.env.JWT_SECRET as string);
        console.log(decodedToken)
        const currentTime = Math.floor(Date.now() / 1000);;
        const user = await Auth.findById(decodedToken.user);

        if (user && decodedToken.iat < currentTime) {
            (req as any).user = user;
            res.locals.user = user;
            next();
        } else {
            return res.status(401).json({ message: 'Not authorized' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.cookies.jwt) {
        return next(new AppError('kindly login or sign up', 401));
      } else if (req.cookies.jwt) {
        const decodedToken = jwt.verify(
          req.cookies.jwt,
          process.env.JWT_SECRET_KEY as string
        ) as { id: string; iat: number; exp: number };
        const currentTime = Math.floor(Date.now() / 1000);
        const user = await UserUrl.findById(decodedToken.id);
  
        if (user && decodedToken.iat < currentTime) res.locals.user = user;
        return next();
      }
  
      next();
    } catch (err: any) {
      next(new AppError(err, 500));
    }
  };
export { isAuthenticated, isLoggedIn}