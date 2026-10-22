import mongoose, { Document, Schema } from 'mongoose';

interface IChat extends Document {
    users: [string, string],
    lastMessage: {
        sender: string,
        content: string,

    },
    timestamp: Date
}


const chatSchema = new Schema<IChat>({
    users: [{ type: String, required: true }],
    lastMessage: {
        sender: { type: String, required: true },
        content: { type: String, required: true },
    },
    timestamp: { type: Date, default: Date.now }

}, { timestamps: true })

const Chat = mongoose.model<IChat>('Chat', chatSchema);
export default Chat;
