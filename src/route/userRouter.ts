import { Router } from 'express';
import * as userController from '../controller/userController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const userRouter = Router();

userRouter.patch('/update', isAuthenticated,userController.updateUser);
userRouter.delete('/delete',isAuthenticated,userController.deleteUser);
userRouter.post('/forget_Password', userController.forgetPassword);
userRouter.patch('/reset_Password/:Token', isAuthenticated,userController.resetPassword);
userRouter.delete('/Deactivate_acct/:id', isAuthenticated, userController.deleteUser);
userRouter.post('/reactivate_account',userController.reactivateAccount);
userRouter.post('/ logout', isAuthenticated,userController.logout);

  

export default userRouter;