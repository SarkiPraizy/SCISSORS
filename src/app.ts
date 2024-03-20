import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRouter from './route/userRouter';
import router from './route/authRoute';
import UrlRouter from './route/url';
import  path  from 'path';
import rateLimit from 'express-rate-limit';
import viewRouter from './route/viewsRouter';
import { signUpUser, signInUser } from './controller/authController';


const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'))
  // console.log(path.join(__dirname, 'views'))

  const appLimiter = rateLimit({
    max: 100, // max allowable number of requests from an IP address in a given timeframe
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many requests from your IP address, please try again later.",
  });
app.use("/", appLimiter); //Use to limit repeated requests to the server

app.use("/api/auth",router)
app.use("/api/url",UrlRouter)
app.use("/api/user",userRouter)
app.use("/", viewRouter)

export default app;
