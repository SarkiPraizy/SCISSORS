import express from 'express';
import { signUpUser, signInUser} from '../controller/authController';

const router = express.Router();

router.post('/signup', signUpUser);
router.post('/login', signInUser);


export default router;