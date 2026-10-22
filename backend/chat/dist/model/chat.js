import mongoose, { Schema } from 'mongoose';
const chatSchema = new Schema({
    users: [{ type: String, required: true }],
    lastMessage: {
        sender: { type: String, required: true },
        content: { type: String, required: true },
    },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });
const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
