import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: String },
    isGroup: { type: Boolean, default: false },
    avatar: { type: String }, // Can store an icon or initials
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
