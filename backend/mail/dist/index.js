import express from 'express';
import dotenv from 'dotenv';
import { connectRabbitMQ, } from './config/rabbitmq.js';
import { startSendotpConsumer } from './consumers/mail.consumer.js';
dotenv.config();
const app = express();
const startServer = async () => {
    try {
        await connectRabbitMQ();
        await startSendotpConsumer();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
};
void startServer();
