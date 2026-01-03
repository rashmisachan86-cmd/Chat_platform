import React from 'react';
import { motion } from 'framer-motion';

const STORIES = [
    { id: '1', name: 'Alice', color: 'from-pink-500 to-orange-400', seen: false },
    { id: '2', name: 'Bob', color: 'from-blue-500 to-cyan-400', seen: true },
    { id: '3', name: 'Carol', color: 'from-purple-500 to-pink-400', seen: false },
    { id: '4', name: 'Dave', color: 'from-yellow-500 to-red-400', seen: true },
    { id: '5', name: 'Eve', color: 'from-green-500 to-emerald-400', seen: false },
];

export const StatusStories: React.FC = () => {
    return (
        <div className="flex gap-4 p-4 overflow-x-auto no-scrollbar bg-white/5 border-b border-white/5">
            {/* Your Story */}
            <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                    <span className="text-xl text-white/40 group-hover:text-purple-400">+</span>
                </div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">You</span>
            </div>

            {STORIES.map(story => (
                <motion.div
                    key={story.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
                >
                    <div className={`p-[2px] rounded-full bg-gradient-to-tr ${story.seen ? 'from-white/10 to-white/10' : story.color} transition-all`}>
                        <div className="w-14 h-14 rounded-full bg-[#13111C] p-1">
                            <div className={`w-full h-full rounded-full bg-gradient-to-br ${story.color} flex items-center justify-center font-bold text-white shadow-inner`}>
                                {story.name[0]}
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] text-white/60 tracking-tight">{story.name}</span>
                </motion.div>
            ))}
        </div>
    );
};
