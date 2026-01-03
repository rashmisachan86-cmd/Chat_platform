import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
// @desc    Create or get a private conversation
// @route   POST /api/conversations
export const createConversation = async (req, res) => {
    const { participantId, isGroup, title } = req.body;
    const userId = req.user?._id; // Assuming auth middleware adds user
    try {
        if (!isGroup) {
            // Check if private conversation already exists
            const existing = await Conversation.findOne({
                isGroup: false,
                participants: { $all: [userId, participantId] }
            });
            if (existing)
                return res.json(existing);
        }
        const newConversation = await Conversation.create({
            title: title || 'New Chat',
            isGroup: !!isGroup,
            participants: isGroup ? [userId, ...participantId] : [userId, participantId]
        });
        res.status(201).json(newConversation);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get user conversations
// @route   GET /api/conversations
export const getConversations = async (req, res) => {
    const userId = req.user?._id;
    try {
        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        }).sort({ updatedAt: -1 });
        res.json(conversations);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=conversationController.js.map