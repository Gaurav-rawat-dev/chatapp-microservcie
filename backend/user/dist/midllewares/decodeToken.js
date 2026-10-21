import jwt from 'jsonwebtoken';
export const decodeToken = async (token) => {
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        console.error('Error decoding token:', error);
        throw new Error('Error decoding token');
    }
};
