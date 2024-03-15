import express from 'express';
import dotenv from 'dotenv';
import {
  shortenUrl,
  costumUrl,
  redirectUrl,
  generateQrCode,
  deleteUrl,
} from '../controller/urlController';
import { isAuthenticated } from '../middlewares/authMiddleware';

dotenv.config();

const UrlRouter = express.Router();

// Short URL generator
UrlRouter.post('/short',isAuthenticated, shortenUrl);
UrlRouter.patch('/:urlId', isAuthenticated,costumUrl)
UrlRouter.get('/:urlId', redirectUrl);
UrlRouter.post('/qrCode',isAuthenticated, generateQrCode);
UrlRouter.delete('/deleteUrl/:urlId', isAuthenticated, deleteUrl)

export default UrlRouter;
