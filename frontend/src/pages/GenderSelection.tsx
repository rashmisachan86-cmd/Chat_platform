import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Zap, Heart, Rocket } from 'lucide-react';

const GenderSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setGender } = useTheme();
  const [hoveredGender, setHoveredGender] = useState<'girl' | 'boy' | null>(null);
  const [selectedGender, setSelectedGender] = useState<'girl' | 'boy' | null>(null);

  const handleGenderSelect = (gender: 'girl' | 'boy') => {
    setSelectedGender(gender);
    setGender(gender);
    
    // Animate and navigate
    setTimeout(() => {
      navigate('/landing');
    }, 800);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-16 h-16 text-yellow-300 mx-auto" />
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              God X
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 font-light">
            Choose your universe to begin the experience
          </p>
        </motion.div>

        {/* Gender Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Girl Card */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onHoverStart={() => setHoveredGender('girl')}
            onHoverEnd={() => setHoveredGender(null)}
            onClick={() => handleGenderSelect('girl')}
            className="cursor-pointer group"
          >
            <div className={`
              relative overflow-hidden rounded-3xl p-12 transition-all duration-500
              ${selectedGender === 'girl' ? 'scale-105' : hoveredGender === 'girl' ? 'scale-105' : 'scale-100'}
              ${selectedGender === 'girl' ? 'ring-4 ring-pink-400' : ''}
            `}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.2), rgba(255, 105, 180, 0.3))',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 182, 193, 0.4)',
              }}
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 50%, rgba(255, 182, 193, 0.4) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(255, 105, 180, 0.4) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 50%, rgba(255, 182, 193, 0.4) 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10">
                <motion.div
                  animate={{
                    scale: hoveredGender === 'girl' ? 1.1 : 1,
                    rotate: hoveredGender === 'girl' ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 flex justify-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center shadow-2xl">
                    <Heart className="w-12 h-12 text-white" fill="white" />
                  </div>
                </motion.div>

                <h2 className="text-4xl font-bold text-white mb-4 text-center">
                  Feminine Universe
                </h2>
                <p className="text-pink-100 text-center text-lg leading-relaxed">
                  Elegant, soft, and beautiful. Experience a world of gentle animations,
                  warm colors, and delightful interactions.
                </p>

                {/* Floating Decorations */}
                {hoveredGender === 'girl' && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <Heart
                          className="text-pink-300"
                          size={12 + Math.random() * 12}
                          fill="currentColor"
                        />
                      </motion.div>
                    ))}
                  </>
                )}

                <motion.div
                  className="mt-8 text-center"
                  animate={{ opacity: hoveredGender === 'girl' ? 1 : 0.7 }}
                >
                  <span className="text-pink-200 font-semibold">Click to enter →</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Boy Card */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onHoverStart={() => setHoveredGender('boy')}
            onHoverEnd={() => setHoveredGender(null)}
            onClick={() => handleGenderSelect('boy')}
            className="cursor-pointer group"
          >
            <div className={`
              relative overflow-hidden rounded-3xl p-12 transition-all duration-500
              ${selectedGender === 'boy' ? 'scale-105' : hoveredGender === 'boy' ? 'scale-105' : 'scale-100'}
              ${selectedGender === 'boy' ? 'ring-4 ring-purple-400' : ''}
            `}
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.3))',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(168, 85, 247, 0.4)',
              }}
            >
              {/* Animated Tech Grid */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                  {[...Array(36)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="border border-purple-400"
                      animate={{
                        opacity: [0.1, 0.5, 0.1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative z-10">
                <motion.div
                  animate={{
                    scale: hoveredGender === 'boy' ? 1.1 : 1,
                    rotate: hoveredGender === 'boy' ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 flex justify-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-white opacity-20"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0, 0.2],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <Rocket className="w-12 h-12 text-white" />
                  </div>
                </motion.div>

                <h2 className="text-4xl font-bold text-white mb-4 text-center">
                  Masculine Universe
                </h2>
                <p className="text-purple-100 text-center text-lg leading-relaxed">
                  Bold, powerful, and dynamic. Enter a realm of cutting-edge design,
                  striking visuals, and powerful features.
                </p>

                {/* Tech Particles */}
                {hoveredGender === 'boy' && (
                  <>
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                          y: [0, -50],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      >
                        <Zap className="text-purple-400" size={8 + Math.random() * 8} />
                      </motion.div>
                    ))}
                  </>
                )}

                <motion.div
                  className="mt-8 text-center"
                  animate={{ opacity: hoveredGender === 'boy' ? 1 : 0.7 }}
                >
                  <span className="text-purple-200 font-semibold">Click to enter →</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-16"
        >
          <p className="text-purple-300 text-sm">
            Your choice shapes your entire experience. You can change this later in settings.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default GenderSelection;
