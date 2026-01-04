import express from 'express';
import { createPost, getPosts, toggleLike } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createPost)
    .get(getPosts);

router.post('/:id/like', protect, toggleLike);

export default router;
