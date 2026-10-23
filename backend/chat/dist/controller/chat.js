import Chat from "../model/chat.js";
import asyncwrapper from '../utils/asyncHandler.js';
export const createChat = asyncwrapper(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
        return;
    }
    const { otherUserId } = req.body;
    if (!otherUserId) {
        res.status(400).json({
            success: false,
            message: "Other user ID is required"
        });
        return;
    }
    const existingChat = await Chat.findOne({
        users: { $all: [userId, otherUserId] }
    });
    if (existingChat) {
        res.status(400).json({
            success: false,
            message: "Chat already exists",
            chatId: existingChat._id
        });
        return;
    }
    const newChat = new Chat({
        users: [userId, otherUserId],
    });
    await newChat.save();
    res.status(201).json({
        success: true,
        message: "chat created",
        chatId: newChat._id
    });
});
