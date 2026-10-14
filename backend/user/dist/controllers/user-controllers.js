import bcrypt from 'bcrypt';
import { randomInt } from 'node:crypto';
import User from '../models/User.js';
import { publishToQueue } from '../config/rabbitmq.js';
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 1. Validate request
        if (typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password) {
            res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        // 2. Find user. Explicitly select password if schema hides it.
        const user = await User.findOne({
            email: normalizedEmail,
        }).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }
        // 3. Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }
        // 4. Generate a cryptographically secure 6-digit OTP
        const otp = randomInt(100000, 1000000).toString();
        // 5. Store only the OTP hash and expiry in the database
        user.loginOtpHash = await bcrypt.hash(otp, 10);
        user.loginOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();
        // 6. Publish the event for the Mail Service
        await publishToQueue('sendotp', {
            email: user.email,
            otp,
        });
        // 7. Ask the user to verify the OTP
        res.status(200).json({
            success: true,
            message: 'OTP requested successfully. Please verify your email.',
            data: {
                email: user.email,
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
