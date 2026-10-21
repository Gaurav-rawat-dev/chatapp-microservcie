import { redis } from '../config/redis.js';
import { randomInt } from 'node:crypto';
import User from '../models/User.js';
import { publishToQueue } from '../config/rabbitmq.js';
import { generateToken } from '../midllewares/generateToken.js';
import { decodeToken } from '../midllewares/decodeToken.js';
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
    const user = await User.findOne({ email });
    if (!user) {
        await User.create({ email, name: email.split('@')[0] });
        return;
    }
    const token = await generateToken(email);
    await redis.del(otpKey);
    res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        data: {
            token
        }
    });
};
export const myProfile = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            message: "Authorization header missing or malformed"
        });
        return;
    }
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = await decodeToken(token);
    console.log('Decoded token:', decoded);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found"
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: "User profile retrieved successfully",
        data: {
            user,
            token
        }
    });
};
export const updateNameController = async (req, res) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
        return;
    }
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found"
        });
        return;
    }
    const { name } = req.body;
    if (!name) {
        res.status(400).json({
            success: false,
            message: "Name is required"
        });
        return;
    }
    user.name = name;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Name updated successfully",
        data: {
            user
        }
    });
};
