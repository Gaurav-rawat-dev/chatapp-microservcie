import dotenv from 'dotenv';
dotenv.config();

import zod from 'zod';
const envschema = zod.object({
    RABBITMQ_HOST: zod.string().default('localhost'),
    RABBITMQ_PORT: zod.string().default('5672'),
    RABBITMQ_USER: zod.string().default('guest'),
    RABBITMQ_PASSWORD: zod.string().default('guest'),
    SMTP_HOST: zod.string().default('smtp.gmail.com'),
    SMTP_PORT: zod.string().default('587'),
    SMTP_SECURE: zod.string().default('false'),
    SMTP_USER: zod.string().default('your-email@gmail.com'),
    SMTP_PASS: zod.string().default('your-16-character-gmail-app-password'),
    MAIL_FROM: zod.string().default('Chat App <your-email@gmail.com>')

})

export const env = envschema.parse(process.env)