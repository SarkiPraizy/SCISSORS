import { Request, Response, NextFunction } from 'express';
import AppError from '../Utils/errorHandler';
import EmailSender from '../Utils/sendEmail';
import SendResponse from '../Utils/sendResponse';
import UserUrl from '../model/UserUrl';
import Auth from '../model/authModel';


const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updateDetails:any = req.body
    console.log((req as any).user)
    if(!updateDetails) return
    const newUpdate = await Auth.findByIdAndUpdate((req as any).user._id, updateDetails, {
      new: true,
      runValidators: true,
    })
    console.log(newUpdate)
    if(!newUpdate) return next(new Error("Bad request! try again later."))

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
  };

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId  = (req as any).user._id;
    const user = await Auth.findByIdAndDelete({ _id: userId });
    if (!user) throw new Error("This user does not exist");

    res.json({ status: true, message: "User deleted"});
  } catch (error) {
    res.status(401).json({ message: 'user deletion failed', error });
  }
};

// const logout = (req: Request, res: Response): void => {
//   res.clearCookie("jwt", {
//     httpOnly: true,
//   });

//   res.status(200).json({ message: "You are logged out" });
// };

async function forgetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await Auth
      .findOne({ email: req.body.email })
      .select("-password");
    if (!user) return next(new AppError("This user does not exist", 404));
    const resetToken = await user.genResetToken();

    console.log(resetToken);
    const url: string = `${req.protocol}://${req.get(
      "host"
    )}/resetPassword/${resetToken}`;
    const sendMail = new EmailSender();
    await sendMail.sendPasswordResetEmail(user, resetToken, url);
    res.status(200).json({
      message: "Your password reset token has been sent. Check your mailbox",
    });
  } catch (err: any) {
    new AppError('Password reset failed', 500);
  }
}

async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const resetToken = req.params.Token;
    const user = await Auth
      .findOne({
        resetPasswordToken: resetToken,
        resetTimeExp: { $gt: Date.now() },
      })
      .select("-password");
    if (!user) return next(new AppError("Invalid token or expired token", 404));

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiryTime = undefined;

    await user.save();
    res
      .status(200)
      .json({ message: "A new password has been set", user });
  } catch (err: any) {
    new AppError('Password reset failed', 500);
  }
}

async function reactivateAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const sendResponse = new SendResponse(res);

  try {
    const user: any = await UserUrl
      .findOne({ email: req.body.email })
      .select("-password");
    if (!user) next(new AppError("This user does not exist", 404));
    user.active = true;
    await user.save();
    sendResponse.sendJson(
      user,
      `Welcome back ${user.username}. Your account has been re-activated`,
      200
    );
  } catch (err: any) {
    new AppError(err, 500);
  }
}

export {
  updateUser,
  // logout,
  forgetPassword,
  resetPassword,
  reactivateAccount,
};