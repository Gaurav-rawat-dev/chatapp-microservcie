import jwt from 'jsonwebtoken'

export const generateToken = async(email: string) => {
    try {
        const token =  await jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Error generating token');
    }
}

export const decodeToken = async(token: string) => {
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET!);
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        throw new Error('Error decoding token');
    }
}