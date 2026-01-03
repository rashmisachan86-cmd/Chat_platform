import { motion } from 'framer-motion';

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a0a0f]">
            {/* Deep Cosmic Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a103c] via-[#0d0b1e] to-[#000000]" />

            {/* Glowing Orbs - Rich Palette */}
            {/* Orb 1: Electric Purple/Blue */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-[#581c87] opacity-30 blur-[120px]"
            />

            {/* Orb 2: Hot Pink/Magenta */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -40, 0],
                    y: [0, 60, 0],
                    rotate: [0, 45, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#be185d] opacity-20 blur-[100px]"
            />

            {/* Orb 3: Cyan/Teal Accent */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 60, 0],
                    y: [0, -40, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-20%] left-[20%] w-[800px] h-[800px] rounded-full bg-[#0e7490] opacity-20 blur-[130px]"
            />

            {/* Orb 4: Deep Violet Center */}
            <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-[#4c1d95] opacity-20 blur-[100px]"
            />

            {/* Cinematic Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.6%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
            />
        </div>
    );
}
