import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  MessageCircle, Users, Video, Image, Heart, Sparkles,
  Shield, Camera, Music
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isGirl } = useTheme();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  const features = [
    { icon: MessageCircle, title: 'Real-time Chat', description: 'Instant messaging with delivery status' },
    { icon: Users, title: 'Group Chats', description: 'Connect with multiple friends' },
    { icon: Video, title: 'Video Calls', description: 'HD video & voice calling' },
    { icon: Image, title: 'Media Sharing', description: 'Photos, videos, and files' },
    { icon: Camera, title: 'Stories', description: '24-hour ephemeral content' },
    { icon: Heart, title: 'Reactions', description: 'Express yourself instantly' },
    { icon: Music, title: 'Voice Messages', description: 'Quick audio messages' },
    { icon: Shield, title: 'End-to-End Encryption', description: 'Your privacy matters' },
  ];

  const stats = [
    { value: '100%', label: 'Passion' },
    { value: '24/7', label: 'Dedication' },
    { value: '∞', label: 'Innovation' },
    { value: '💝', label: 'Love & Care' },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-700">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: isGirl
                ? `radial-gradient(circle, rgba(255, 182, 193, ${Math.random() * 0.1}) 0%, transparent 70%)`
                : `radial-gradient(circle, rgba(168, 85, 247, ${Math.random() * 0.1}) 0%, transparent 70%)`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 50 - 25, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
      >
        <div className="max-w-7xl w-full">
          <div className="text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
              className="mb-8 inline-block"
            >
              <div className={`
                w-32 h-32 rounded-3xl flex items-center justify-center text-6xl font-black shadow-2xl
                ${isGirl ? 'bg-gradient-to-br from-pink-400 to-rose-500' : 'bg-gradient-to-br from-purple-500 to-indigo-600'}
              `}>
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-white"
                >
                  X
                </motion.span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-8xl font-black text-foreground mb-6 leading-tight"
            >
              Welcome to{' '}
              <span className={`
                ${isGirl
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600'
                  : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600'
                }
                bg-clip-text text-transparent
              `}>
                God X
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              The ultimate social experience. Connect, share, and express yourself
              like never before.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className={`
                  px-12 py-5 text-xl font-bold text-white rounded-2xl shadow-2xl relative overflow-hidden
                  ${isGirl
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                  }
                `}
              >
                <motion.div
                  className="absolute inset-0 bg-white opacity-0"
                  whileHover={{ opacity: 0.2 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Get Started <Sparkles className="w-6 h-6" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-12 py-5 text-xl font-bold text-foreground bg-card border-2 border-border rounded-2xl shadow-lg"
              >
                Sign In
              </motion.button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-20"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-muted-foreground"
              >
                <div className="text-sm mb-2">Discover More</div>
                <div className="w-6 h-10 border-2 border-current rounded-full mx-auto flex justify-center">
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1 h-2 bg-current rounded-full mt-2"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay connected with the people you love
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className={`
                  p-8 rounded-3xl backdrop-blur-xl border-2 cursor-pointer
                  ${isGirl
                    ? 'bg-gradient-to-br from-pink-50/50 to-rose-50/50 border-pink-200/50'
                    : 'bg-card/50 border-border'
                  }
                `}
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mb-6
                    ${isGirl
                      ? 'bg-gradient-to-br from-pink-400 to-rose-500'
                      : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                    }
                  `}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Created With Love Section */}
      <section className={`
        py-32 px-6 relative
        ${isGirl
          ? 'bg-gradient-to-br from-pink-100/30 to-rose-100/30'
          : 'bg-gradient-to-br from-purple-900/10 to-indigo-900/10'
        }
      `}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <Heart
                className={`w-20 h-20 ${
                  isGirl ? 'text-pink-500' : 'text-purple-500'
                }`}
                fill="currentColor"
              />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Created with Love & Efforts
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A passionate startup project built with dedication, creativity, and the vision
              to create something extraordinary. Every feature crafted with care.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`
                    text-6xl md:text-7xl font-black mb-4
                    ${isGirl
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                    }
                    bg-clip-text text-transparent
                  `}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xl text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`
              p-16 rounded-[3rem] relative overflow-hidden
              ${isGirl
                ? 'bg-gradient-to-br from-pink-500 to-rose-600'
                : 'bg-gradient-to-br from-purple-600 to-indigo-700'
              }
            `}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 200 + 100,
                    height: Math.random() * 200 + 100,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Ready to Join?
              </h2>
              <p className="text-2xl text-white/90 mb-12">
                Start your journey with God X today
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-16 py-6 text-2xl font-bold bg-white text-purple-600 rounded-2xl shadow-2xl"
              >
                Create Account Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            © 2026 God X. Crafted with passion and innovation.
          </p>
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
            <a href="#" className="hover:text-foreground transition-colors">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
