import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import auth from '../model/authModel';
import genToken from '../Utils/genToken';
import EmailSender from '../Utils/sendEmail';
import AppError from '../Utils/errorHandler';


const signUpUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const user: any = await auth.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    if (!user) return next(new AppError("Bad request! try again later.", 400))


    const token: string = genToken(user._id);

    const mail = new EmailSender()
    await mail.sendWelcomeEmail(user)


      res.status(201).json({
        status: 'success', 
        message: "Signup successful!",
        token,
        data: {
          user,
        },
      });
    
    } catch (error: any) {
      next(new AppError(error, 500));
  }
};

const signInUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Bad request! Email and Password are required.', 400));
    }

    const user: any | null = await auth.findOne({ email }).select('+password');
    

    if (!user) {
      return next(new AppError('No user was found.', 404));
    }
    const isValid = await user.isCorrectPassword(password)
    if(!isValid) return next(new AppError("invalid password or email",401))

    const token: string = genToken(user._id);

      res.status(200).json({
        status: 'success',
        message: "Signin successful!",
        token,
        data: {
          user,
        },
      });
     if (!user) return next(new AppError("Bad request! try again later.", 400))
    }
   catch (error: any) {
    next(new AppError(error, 500));
  }
};



export {signUpUser, signInUser}