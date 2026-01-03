import User from '../models/User.js';
import jwt from 'jsonwebtoken';
const generateToken = (id) => {
    return jwt.sign({ id }, "godx_ultra_secret_999", { expiresIn: '30d' });
};
// @desc    Register new user
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
    const { username, password, gender } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ username, password, gender });
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id.toString())
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Auth user & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                gender: user.gender,
                token: generateToken(user._id.toString())
            });
        }
        else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
    const userId = req.user?._id;
    const { gender, vibe, accentColor, chatWallpaper, soundsEnabled } = req.body;
    try {
        const user = await User.findById(userId);
        if (user) {
            if (gender)
                user.gender = gender;
            if (vibe)
                user.vibe = vibe;
            if (accentColor)
                user.accentColor = accentColor;
            if (chatWallpaper !== undefined)
                user.chatWallpaper = chatWallpaper;
            if (soundsEnabled !== undefined)
                user.soundsEnabled = soundsEnabled;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                gender: updatedUser.gender,
                vibe: updatedUser.vibe,
                accentColor: updatedUser.accentColor,
                chatWallpaper: updatedUser.chatWallpaper,
                soundsEnabled: updatedUser.soundsEnabled,
                token: generateToken(updatedUser._id.toString())
            });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Search for users
// @route   GET /api/auth/users
export const searchUsers = async (req, res) => {
    const { search } = req.query;
    const userId = req.user?._id;
    try {
        const users = await User.find({
            username: { $regex: search, $options: 'i' },
            _id: { $ne: userId }
        })
            .select('username gender vibe accentColor')
            .limit(10);
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=authController.js.map