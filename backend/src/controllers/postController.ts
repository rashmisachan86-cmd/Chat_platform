import type { Request, Response } from 'express';
import Post from '../models/Post.js';

// @desc    Create a post
// @route   POST /api/posts
export const createPost = async (req: Request, res: Response) => {
    const { image, caption } = req.body;
    const userId = (req as any).user?._id;

    if (!image) {
        return res.status(400).json({ message: 'Image is required' });
    }

    try {
        const post = await Post.create({
            user: userId,
            image,
            caption
        });
        
        const populatedPost = await post.populate('user', 'username gender profilePic');
        res.status(201).json(populatedPost);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all posts
// @route   GET /api/posts
export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username gender profilePic')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like/Unlike a post
// @route   POST /api/posts/:id/like
export const toggleLike = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.json({ liked: !isLiked, count: post.likes.length });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
