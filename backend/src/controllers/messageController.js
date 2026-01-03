import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
// @desc    Send a message
// @route   POST /api/messages
export const sendMessage = async (req, res) => {
    const { conversationId, text, type, contentUrl, replyTo, isSecret } = req.body;
    const userId = req.user?._id;
    try {
        const message = await Message.create({
            from: userId,
            conversation: conversationId,
            text,
            type,
            contentUrl,
            replyTo,
            isSecret
        });
        // Update last message in conversation
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: text || `Sent an ${type}`
        });
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
export const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const messages = await Message.find({ conversation: conversationId })
            .populate('from', 'username gender')
            .sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=messageController.js.map