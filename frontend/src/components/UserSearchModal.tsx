import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { FiSearch, FiUserPlus, FiLoader } from 'react-icons/fi';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
    _id: string;
    username: string;
    gender: string;
    vibe: string;
    accentColor: string;
}

export function UserSearchModal({ onChatCreated }: { onChatCreated: (convId: string) => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim()) {
                searchUsers();
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const searchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/auth/users?search=${searchTerm}`);
            setResults(data);
        } catch (err) {
            console.error('Search failed', err);
        } finally {
            setLoading(false);
        }
    };

    const startChat = async (participantId: string) => {
        try {
            const { data } = await api.post('/conversations', { participantId });
            onChatCreated(data._id);
            setOpen(false);
            setSearchTerm('');
        } catch (err) {
            console.error('Failed to start chat', err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="p-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white transition-all shadow-lg shadow-purple-500/20 active:scale-95">
                    <FiUserPlus size={20} />
                </button>
            </DialogTrigger>
            <DialogContent className="glass-premium border-white/10 text-white sm:max-w-md rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">Find Friends</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="relative group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors" size={18} />
                        <Input
                            placeholder="Search by username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border-white/10 rounded-2xl py-6 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder-white/20"
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <FiLoader className="animate-spin text-purple-500" size={24} />
                            </div>
                        ) : results.length > 0 ? (
                            <AnimatePresence>
                                {results.map((user) => (
                                    <motion.div
                                        key={user._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
                                                style={{ backgroundColor: user.accentColor || '#8B5CF6' }}
                                            >
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.username}</div>
                                                <div className="text-[10px] text-white/40 uppercase tracking-widest">{user.vibe}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => startChat(user._id)}
                                            className="p-2 rounded-xl bg-white/5 text-purple-400 opacity-0 group-hover:opacity-100 hover:bg-purple-500 hover:text-white transition-all"
                                        >
                                            <FiMessageSquare size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        ) : searchTerm.trim() ? (
                            <div className="text-center py-8 text-white/20 text-sm">No users found</div>
                        ) : (
                            <div className="text-center py-8 text-white/20 text-sm italic">Type to search for peers...</div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
