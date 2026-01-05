import type { Request, Response } from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
    return jwt.sign({ id }, "godx_ultra_secret_999", { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/signup
export const signup = async (req: Request, res: Response) => {
    const { username, password, gender } = req.body;
    console.log(`📝 Signup attempt: ${username}`);

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            console.log(`⚠️ Signup failed: User ${username} already exists`);
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, password, gender });
        if (user) {
            console.log(`✅ User created: ${username}`);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                gender: user.gender,
                profilePic: user.profilePic,
                bio: user.bio,
                followers: user.followers,
                following: user.following,
                token: generateToken(user._id.toString())
            });
        }
    } catch (error: any) {
        console.error(`❌ Signup error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user && (await (user as any).matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                gender: user.gender,
                profilePic: user.profilePic,
                token: generateToken(user._id.toString())
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const { gender, vibe, accentColor, chatWallpaper, soundsEnabled, profilePic, bio } = req.body;

    try {
        const user = await User.findById(userId);
        if (user) {
            if (gender) user.gender = gender;
            if (vibe) user.vibe = vibe;
            if (accentColor) user.accentColor = accentColor;
            if (chatWallpaper !== undefined) user.chatWallpaper = chatWallpaper;
            if (soundsEnabled !== undefined) user.soundsEnabled = soundsEnabled;
            if (profilePic !== undefined) user.profilePic = profilePic;
            if (bio !== undefined) user.bio = bio;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                gender: updatedUser.gender,
                vibe: updatedUser.vibe,
                accentColor: updatedUser.accentColor,
                chatWallpaper: updatedUser.chatWallpaper,
                soundsEnabled: updatedUser.soundsEnabled,
                profilePic: updatedUser.profilePic,
                bio: updatedUser.bio,
                followers: updatedUser.followers,
                following: updatedUser.following,
                token: generateToken(updatedUser._id.toString())
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Follow/Unfollow a user
// @route   POST /api/auth/users/:id/follow
export const toggleFollow = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const targetId = req.params.id;

    if (userId.toString() === targetId) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    try {
        const user = await User.findById(userId);
        const targetUser = await User.findById(targetId);

        if (!user || !targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = user.following.some(id => id.toString() === targetId);

        if (isFollowing) {
            // Unfollow
            user.following = user.following.filter(id => id.toString() !== targetId);
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId.toString());
        } else {
            // Follow
            user.following.push(targetId as any);
            targetUser.followers.push(userId as any);
        }

        await user.save();
        await targetUser.save();

        res.json({ 
            following: !isFollowing,
            userFollowing: user.following 
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile by username
// @route   GET /api/auth/users/:username
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-password')
            .populate('followers', 'username profilePic gender')
            .populate('following', 'username profilePic gender');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search for users
// @route   GET /api/auth/users
export const searchUsers = async (req: Request, res: Response) => {
    const { search } = req.query;
    const userId = (req as any).user?._id;

    try {
        const users = await User.find({
            username: { $regex: search, $options: 'i' },
            _id: { $ne: userId }
        })
            .select('username gender vibe accentColor profilePic')
            .limit(10);

        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

