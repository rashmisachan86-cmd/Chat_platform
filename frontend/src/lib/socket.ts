import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5050';

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true
});

export const connectSocket = (userId: string) => {
    if (!socket.connected) {
        socket.connect();
        socket.emit('setup', userId);
    }
};

export const joinChat = (chatId: string) => {
    socket.emit('join_chat', chatId);
};
