import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config()

import connectDb from './config/db.js';
import { redis } from './config/redis.js';
import { connectRabbitMQ, publishToQueue } from './config/rabbitmq.js';
import userRouter from './routes/userRoutes.js';

const port = process.env.PORT;

async function startServer() {

  try {
    await connectDb();


    const app = express();
    app.use(express.json());
    await connectRabbitMQ();

    await redis.set('connection-test', 'OK')

    const result = await redis.get('connection-test');
    if (result === 'OK') {
      console.log('Redis connection successful');
    } else {
      console.error('Redis connection failed');
    }

    // app.get('/', (req: Request, res: Response) => {
    //   console.log('Received a GET request at /');
    //   res.json({ 'message': 'Hello, World!' });
    // });

    app.use('/api/v1', userRouter);
    


    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}

startServer()

