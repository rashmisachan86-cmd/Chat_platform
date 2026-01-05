import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';

const CursorFollower: React.FC = () => {
  const { isGirl } = useTheme();
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  // Only show on landing page
  const isLandingPage = location.pathname === '/landing' || location.pathname === '/gender';

  useEffect(() => {
    if (!isLandingPage) {
      setIsVisible(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLandingPage, isVisible]);

  if (!isLandingPage || !isVisible) return null;

  return (
    <motion.div
      className="fixed w-6 h-6 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      animate={{
        x: mousePosition.x - 12,
        y: mousePosition.y - 12,
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 250, restDelta: 0.001 }}
      style={{
        background: isGirl ? 'rgba(255, 182, 193, 0.9)' : 'rgba(168, 85, 247, 0.9)',
        boxShadow: isGirl ? '0 0 20px rgba(255, 182, 193, 0.4)' : '0 0 20px rgba(168, 85, 247, 0.4)',
      }}
    />
  );
};

export default CursorFollower;
