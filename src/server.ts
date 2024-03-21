import { config } from 'dotenv';
config();
import {mongoDbConnection  } from './config';
import app from './app';
import mongoose from 'mongoose';

const PORT: number = 7070;
const HOSTNAME: string = '0.0.0.0';
console.log(process.env.NODE_ENV)

// Connect to the database when the application starts
mongoDbConnection();

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on port ${PORT}`);
});


