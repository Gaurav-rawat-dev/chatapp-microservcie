
import type { Request, Response } from 'express';
import {redis} from '../config/redis.js';
import bcrypt from 'bcrypt';
import { randomInt } from 'node:crypto';

import User from '../models/User.js'
import { publishToQueue } from '../config/rabbitmq.js';

export const loginController = async ( req: Request, res: Response ): Promise<void> => {
    console.log('Login controller invoked with request body:', req.body);
    try {
        const { email } = req.body as {
            email?: string;
        };

        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required',
            });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Find user. Explicitly select password if schema hides it.
        // const user = await User.findOne({
        //     email: normalizedEmail,
        // })

        // if (!user) {
        //     res.status(401).json({
        //         success: false,
        //         message: 'Invalid email. Please check your email and try again.',
        //     });
        //     return;
        // }
        
        const rateLimitKey = `otp:ratelimit:${email}`
        const rateLimit = await redis.get(rateLimitKey);
        if(rateLimit){
            res.status(429).json({
                success: false,
                message: 'Too many OTP requests. Please try again later.',
            });
            return;
        }

        // 4. Generate a cryptographically secure 6-digit OTP
        const otp = randomInt(100000, 1000000).toString();
        const otpKey = `otp:${email}`

        await redis.set(otpKey, otp, { ex: 300 }) // 5 minutes expiry    })
        await redis.set(rateLimitKey, "true", { ex: 60 }) // 1 minute rate limit})



        // 5. Store only the OTP hash and expiry in the database


        // 6. Publish the event for the Mail Service
        await publishToQueue('sendotp', {
            // email: user.email,
            email: normalizedEmail,
            otp,
        });

        // 7. Ask the user to verify the OTP
        res.status(200).json({
            success: true,
            message: 'OTP requested successfully. Please verify your email.',
            data: {
                email: normalizedEmail,
                otpExpiresInSeconds: 300,
            },
        });
    } catch (error) {
        console.error('Login controller error:', error);

        res.status(500).json({
            success: false,
            message: 'Unable to process login right now',
        });
    }
};
