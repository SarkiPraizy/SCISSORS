import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();


const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '13546')
    }
});

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

export default client;