import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import UserUrl from '../model/UserUrl';
import qr from 'qrcode';





export const shortenUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userInput = req.body
    userInput.shortId = crypto.randomBytes(Math.ceil(1/ 2)).toString('hex').slice(0, 10)
    const newUrl: string = `${(req as any).protocol}://${(req as any).get('host')}/api/url/${userInput.shortId}`
    userInput.newUrl = newUrl
    userInput.user_id = (req as any).user._id
    console.log(userInput.user_id)
    console.log((req as any).user)
    const shortenedUrl = await UserUrl.create(
      userInput) 
    res.status(201).json({status:'Sucess', message: 'Created Successfully', data: shortenedUrl})
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};


export const costumUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const existingUrl: any = await UserUrl.findOne({shortId:req.params.urlId, user_id:(req as any).user._id})
    console.log(existingUrl)
  if (! existingUrl || existingUrl === null) throw new Error('Not found')
  
  if(existingUrl?.user_id.toString() === (req as any).user._id.toString()){
    existingUrl.shortId = req.body? req.body.shortId: existingUrl?.shortId
    existingUrl.newUrl = `${(req as any).protocol}://${(req as any).get('host')}/api/url/${existingUrl.shortId}`
    await existingUrl.save() 
    res.status(201).json({status: 'Success', message: 'Updated Sucessfully', data: existingUrl})
  }
  else{ new Error('This user is not authorized')
}


} catch(err){
  console.log(err);
  res.status(500).send('Server error');
  
}
};


export const redirectUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let url: any = await UserUrl.findOne({ shortId: req.params.urlId });
    console.log(req.params.urlId)
    console.log(url);
    if (!url)  new Error("no Url was found")
    if (url) url.clicks = url.clicks + 1
      res.status(302).redirect(url.origUrl);

  } catch (err) {
    console.log(err);
    res.status(500).send('input a valid url');
  }
};



export const generateQrCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shortUrl: string = req.body.shortUrl;
      console.log(shortUrl);
      
      const qrCodeData: string = await qr.toDataURL(shortUrl);
  
      res.render('image', { qrCode: qrCodeData });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error generating QR code');
    }
  };
    
  
  
export const deleteUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try{
        const existingUrl: any = await UserUrl.findOne({shortId:req.params.urlId, user_id:(req as any).user._id})
        console.log(existingUrl)
        console.log((req as any).user)
      if (! existingUrl || existingUrl === null) throw new Error('Url not found')
      
      if(existingUrl?.user_id.toString() === (req as any).user._id.toString()){
        existingUrl.shortId = req.body? req.body.shortId: existingUrl?.shortId
        existingUrl.newUrl = `${(req as any).protocol}://${(req as any).get('host')}/api/url/${existingUrl.shortId}`
        await existingUrl.save() 
        res.status(201).json({status: 'Success', message: 'You have deleted this Url', data: existingUrl})
      }
      else{ new Error('This user is not authorized')
    }
    
      } catch(err){
      console.log(err);
      res.status(500).send('Server error');
      }
}