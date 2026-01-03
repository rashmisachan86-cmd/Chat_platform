import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    text: { type: String },
    type: { type: String, enum: ['text', 'image', 'audio'], default: 'text' },
    contentUrl: { type: String },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    isSecret: { type: Boolean, default: false },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
    reactions: [{ type: String }],
    isStarred: { type: Boolean, default: false }
}, { timestamps: true });

// TTL for secret messages (optional, manually controlled usually but can be added)
// messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60, partialFilterExpression: { isSecret: true } });

const Message = mongoose.model('Message', messageSchema);
export default Message;
