import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import auth from '../model/authModel';
import genToken from '../Utils/genToken';
import EmailSender from '../Utils/sendEmail';


// interface User {
//   _id?: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   __v?: number;
// }

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
    if (!user) return next(new Error("Bad request! try again later."))


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
    
    } catch (error) {
    next(error);
  }
};

const signInUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new Error('Bad request! Email and Password are required.'));
    }

    const user: any | null = await auth.findOne({ email }).select('+password');
    console.log(user)

    if (!user) {
      return next(new Error('No user was found.'));
    }
    const isValid = await user.isCorrectPassword(password)
    if(!isValid) return next(new Error("invalid password or email"))

    const token: string = genToken(user._id);

      res.status(200).json({
        status: 'success',
        message: "Signin successful!",
        token,
        data: {
          user,
        },
      });
     if (!user) return next(new Error("Bad request! try again later."))
    }
   catch (error) {
    next(error);
  }
};



export {signUpUser, signInUser}