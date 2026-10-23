import { decodeToken } from './decodeToken.js';
export const isAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Authorization header missing or malformed"
        });
    }
    // const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const token = authHeader.split(" ")[1];
    try {
        const decoded = await decodeToken(token);
        if (typeof decoded !== 'object' || decoded === null || typeof decoded.email !== 'string') {
            throw new Error('Token payload does not contain an email');
        }
        req.user = { _id: decoded._id, email: decoded.email };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};
