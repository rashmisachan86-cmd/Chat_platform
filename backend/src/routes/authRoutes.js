import express from 'express';
import { signup, login, updateProfile, searchUsers } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, searchUsers);
export default router;
//# sourceMappingURL=authRoutes.js.map