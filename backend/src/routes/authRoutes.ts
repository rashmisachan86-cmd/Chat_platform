import express from 'express';
import { signup, login, updateProfile, searchUsers, toggleFollow, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, searchUsers);
router.get('/users/:username', protect, getUserProfile);
router.post('/users/:id/follow', protect, toggleFollow);

export default router;
