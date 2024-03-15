import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRouter from './route/userRouter';
import router from './route/authRoute';
import UrlRouter from './route/url';
import  path  from 'path';
import rateLimit from 'express-rate-limit';


const app = express();

app.use(bodyParser.json());
app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  console.log(path.join(__dirname, 'views'))

  const appLimiter = rateLimit({
    max: 100, // max allowable number of requests from an IP address in a given timeframe
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many requests from your IP address, please try again later.",
  });
app.use("/", appLimiter); //Use to limit repeated requests to the server

app.use("/api/auth",router)
app.use("/api/url",UrlRouter)
app.use("/api/user",userRouter)
// app.get("/", (req: Request, res: Response) => {
//   res.send("Welcome to the homepage");
// });

export default app;
