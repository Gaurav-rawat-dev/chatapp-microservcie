import { redis } from '../config/redis.js';
import { randomInt } from 'node:crypto';
import { publishToQueue } from '../config/rabbitmq.js';
import { generateToken } from '../midllewares/generateToken.js';
export const loginController = async (req, res) => {
    console.log('Login controller invoked with request body:', req.body);
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required',
            });
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        const rateLimitKey = `otp:ratelimit:${email}`;
        const rateLimit = await redis.get(rateLimitKey);
        if (rateLimit) {
            res.status(429).json({
                success: false,
                message: 'Too many OTP requests. Please try again later.',
            });
            return;
        }
        // 4. Generate a cryptographically secure 6-digit OTP
        const otp = randomInt(100000, 1000000).toString();
        const otpKey = `otp:${email}`;
        await redis.set(otpKey, otp, { ex: 300 }); // 5 minutes expiry    })
        await redis.set(rateLimitKey, "true", { ex: 60 }); // 1 minute rate limit})
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
    }
    catch (error) {
        console.error('Login controller error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to process login right now',
        });
    }
};
export const verifyOtpController = async (req, res) => {
    //  steps 
    // 1. Get the email and otp from the request body
    const { email, otp } = req.body;
    // 2. Validate the input
    if (!email || !otp) {
        res.status(400).json({
            success: false,
            message: "Email and OTP are required"
        });
        return;
    }
    // 3. Retrieve the OTP hash from Redis
    const otpKey = `otp:${email}`;
    const storedOtp = await redis.get(otpKey);
    // 4. Compare the provided OTP with the stored hash
    if (storedOtp !== otp) {
        res.status(400).json({
            success: false,
            message: "Invalid OTP"
        });
    }
    // 5. If valid, generate a JWT token and send it back to the user
    const token = await generateToken(email);
    await redis.del(otpKey);
    res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        data: {
            token
        }
    });
    // facing issue : generating token, want to debug it amd learn debug how to do it
    //  steps to debug :
    // 1. Use console.log statements to print the values of variables at different points in the code.
    // 2. Use a debugger to step through the code and inspect the values of variables.
    // 3. Check the logs for any error messages or stack traces that can help identify the issue.
    // 4. Verify that the JWT_SECRET environment variable is set correctly and is accessible in the code.
    // 5. Ensure that the jwt.sign function is being called with the correct parameters and that it is returning a valid token.
};
