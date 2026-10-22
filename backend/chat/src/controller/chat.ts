import { Request, Response } from 'express';
import Chat from "../model/chat.js";

export const createChat = async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderId, receiverId } = req.body as { senderId: string; receiverId: string };
        const chat = await Chat.create({
            users: [senderId, receiverId],
            lastMessage: {
                sender: senderId,
                content: ''
            }
        });
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Error creating chat' });
    }
};  
