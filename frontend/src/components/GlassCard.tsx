import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function GlassCard({ children, className = '', delay = 0 }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, y: 0, backdropFilter: "blur(20px)" }}
            transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }} // smooth easeOutQuint
            className={`
        relative overflow-hidden
        bg-[#13111C]/60
        shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)]
        rounded-[32px]
        border border-white/10
        ${className}
      `}
            style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
        >
            {/* Soft Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none" />

            {/* Top Highlight Shine */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
