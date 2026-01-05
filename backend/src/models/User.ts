import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['Boy', 'Girl'], default: 'Boy' },
    vibe: { type: String, default: 'Chill' },
    accentColor: { type: String, default: '#8B5CF6' },
    chatWallpaper: { type: String, default: 'dots' },
    soundsEnabled: { type: Boolean, default: true },
    profilePic: { type: String, default: '' },
    lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
