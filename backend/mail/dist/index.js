import express from 'express';
import dotenv from 'dotenv';
import { connectRabbitMQ, consumeFromQueue } from './config/rabbitmq.js';
dotenv.config();
const app = express();
await connectRabbitMQ();
await consumeFromQueue('test-queue', (msg) => {
    if (msg) {
        const messageContent = msg.content.toString();
        console.log('Received message and shown in mail service:', messageContent);
    }
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
