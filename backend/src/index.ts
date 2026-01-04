import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "https://chat-platform-one-tau.vercel.app",
            "https://chat-platform.vercel.app"
        ],
        methods: ["GET", "POST"]
    }
});

// Middlewares
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://chat-platform-one-tau.vercel.app",
        "https://chat-platform.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);

// Database Connection
connectDB();

// Basic Routes
app.get('/', (req, res) => {
    res.json({ message: "🚀 GodX API is live and encrypted." });
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('📡 New peer connected:', socket.id);

    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`👤 User joined channel: ${chatId}`);
    });

    socket.on('typing', (data) => {
        socket.to(data.chatId).emit('typing', data);
    });

    socket.on('new_message', (newMsg) => {
        const chatId = newMsg.conversation;
        if (!chatId) return;
        socket.to(chatId).emit('message_received', newMsg);
    });

    socket.on('disconnect', () => {
        console.log('⚡ Peer disconnected');
    });
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
    console.log(`🔥 [GodX Server] Running on http://localhost:${PORT}`);
});
