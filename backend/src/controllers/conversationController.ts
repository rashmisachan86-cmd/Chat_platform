import type { Request, Response } from 'express';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

// @desc    Create or get a private conversation
// @route   POST /api/conversations
export const createConversation = async (req: Request, res: Response) => {
    const { participantId, isGroup, title } = req.body;
    const userId = (req as any).user?._id; // Assuming auth middleware adds user

    try {
        if (!isGroup) {
            // Check if private conversation already exists
            const existing = await Conversation.findOne({
                isGroup: false,
                participants: { $all: [userId, participantId] }
            }).populate('participants', 'username gender profilePic');
            
            if (existing) return res.json(existing);
        }

        const newConversation = await Conversation.create({
            title: title || 'New Chat',
            isGroup: !!isGroup,
            participants: isGroup ? [userId, ...participantId] : [userId, participantId]
        });

        const populatedConversation = await newConversation.populate('participants', 'username gender profilePic');
        res.status(201).json(populatedConversation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user conversations
// @route   GET /api/conversations
export const getConversations = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;

    try {
        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        })
            .populate('participants', 'username gender profilePic')
            .sort({ updatedAt: -1 });
        res.json(conversations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
