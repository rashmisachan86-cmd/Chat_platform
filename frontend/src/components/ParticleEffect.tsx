import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    char: string;
    color: string;
}

export const ParticleEffect: React.FC<{ type: 'confetti' | 'fire' | null, onComplete: () => void }> = ({ type, onComplete }) => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (!type) return;

        const count = 30;
        const newParticles: Particle[] = [];
        const chars = type === 'confetti' ? ['🎈', '🎉', '✨', '💖', '⭐'] : ['🔥', '💥', '✨', '🧨'];
        const colors = type === 'confetti' ? ['text-pink-400', 'text-yellow-400', 'text-blue-400'] : ['text-red-500', 'text-orange-500', 'text-yellow-400'];

        for (let i = 0; i < count; i++) {
            newParticles.push({
                id: Math.random(),
                x: Math.random() * 100,
                y: 100 + Math.random() * 20,
                char: chars[Math.floor(Math.random() * chars.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }
        setParticles(newParticles);

        const timer = setTimeout(() => {
            setParticles([]);
            onComplete();
        }, 3000);

        return () => clearTimeout(timer);
    }, [type, onComplete]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 1, y: '100vh', x: `${p.x}vw`, scale: 0 }}
                        animate={{
                            opacity: [1, 1, 0],
                            y: '-10vh',
                            x: `${p.x + (Math.random() * 20 - 10)}vw`,
                            scale: [1, 1.5, 1],
                            rotate: 360
                        }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                        className={`absolute text-2xl ${p.color}`}
                    >
                        {p.char}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
