import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Play, Pause } from 'lucide-react';

interface MediaPreviewProps {
    type: 'image' | 'audio';
    url: string;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ type, url }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    if (type === 'audio') {
        return (
            <div className="flex items-center gap-3 bg-black/20 p-2 rounded-xl border border-white/10 min-w-[200px]">
                <audio
                    ref={audioRef}
                    src={url}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                />
                <button
                    onClick={toggleAudio}
                    className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
                </button>
                <div className="flex-1 space-y-1">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-purple-400"
                            animate={{ width: isPlaying ? '100%' : '0%' }}
                            transition={{ duration: 10, ease: 'linear' }} // Mock progress for simulation
                        />
                    </div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Voice Note</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="relative group cursor-pointer" onClick={() => setIsExpanded(true)}>
                <img
                    src={url}
                    alt="Shared media"
                    className="max-w-full rounded-lg border border-white/10 hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                    <Maximize2 className="text-white" size={24} />
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setIsExpanded(false)}
                    >
                        <button className="absolute top-6 right-6 p-2 text-white/50 hover:text-white">
                            <X size={32} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={url}
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
