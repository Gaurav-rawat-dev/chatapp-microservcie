import Chat from "../model/chat.js";
export const createChat = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const chat = await Chat.create({
            users: [senderId, receiverId],
            lastMessage: {
                sender: senderId,
                content: ''
            }
        });
        res.status(201).json(chat);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating chat' });
    }
};
