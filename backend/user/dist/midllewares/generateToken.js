import jwt from 'jsonwebtoken';
import User from "../models/User.js";
export const generateToken = async (email) => {
    try {
        const user = await User.findOne({
            email
        });
        const token = await jwt.sign({ _id: user?._id, email: user?.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    }
    catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Error generating token');
    }
};
