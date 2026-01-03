import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming utils exists, or use standard class concatenation

interface MascotProps {
  state?: 'idle' | 'focus' | 'error' | 'success';
  className?: string;
}

const Mascot: React.FC<MascotProps> = ({ state = 'idle', className }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Eye tracking logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Limit eye movement range
      const x = Math.min(Math.max((e.clientX - window.innerWidth / 2) / 30, -5), 5);
      const y = Math.min(Math.max((e.clientY - window.innerHeight / 2) / 30, -5), 5);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Blinking logic
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const eyeOffsetX = state === 'focus' ? 0 : mousePos.x;
  const eyeOffsetY = state === 'focus' ? 5 : mousePos.y;

  return (
    <div className={cn("relative w-32 h-32 transition-transform duration-300", className)}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Head */}
        <circle cx="50" cy="50" r="40" fill="white" stroke="rgb(255, 182, 193)" strokeWidth="2" />
        
        {/* Blush */}
        <circle cx="25" cy="55" r="5" fill="rgb(255, 182, 193)" opacity="0.6" />
        <circle cx="75" cy="55" r="5" fill="rgb(255, 182, 193)" opacity="0.6" />

        {/* Eyes Container */}
        <g transform={`translate(${eyeOffsetX}, ${eyeOffsetY})`}>
          {state === 'focus' ? (
             // Closed/Shy Eyes
             <>
               <path d="M 20 45 Q 30 50 40 45" stroke="rgb(50, 50, 50)" strokeWidth="3" fill="none" />
               <path d="M 60 45 Q 70 50 80 45" stroke="rgb(50, 50, 50)" strokeWidth="3" fill="none" />
               {/* Hands covering eyes */}
               <circle cx="30" cy="50" r="8" fill="white" stroke="rgb(255, 182, 193)" strokeWidth="1" />
               <circle cx="70" cy="50" r="8" fill="white" stroke="rgb(255, 182, 193)" strokeWidth="1" />
             </>
          ) : isBlinking ? (
            // Blinking Eyes
            <>
              <line x1="20" y1="45" x2="40" y2="45" stroke="rgb(50, 50, 50)" strokeWidth="3" />
              <line x1="60" y1="45" x2="80" y2="45" stroke="rgb(50, 50, 50)" strokeWidth="3" />
            </>
          ) : (
            // Normal Eyes
            <>
              <circle cx="30" cy="45" r="6" fill="rgb(50, 50, 50)" />
              <circle cx="32" cy="43" r="2" fill="white" />
              <circle cx="70" cy="45" r="6" fill="rgb(50, 50, 50)" />
              <circle cx="72" cy="43" r="2" fill="white" />
            </>
          )}
        </g>
        
        {/* Mouth */}
        {state === 'error' ? (
          <path d="M 40 70 Q 50 65 60 70" stroke="rgb(50, 50, 50)" strokeWidth="2" fill="none" />
        ) : state === 'success' ? (
          <path d="M 40 65 Q 50 75 60 65" stroke="rgb(50, 50, 50)" strokeWidth="2" fill="none" />
        ) : (
          <path d="M 45 70 Q 50 72 55 70" stroke="rgb(50, 50, 50)" strokeWidth="2" fill="none" />
        )}
      </svg>
      {state === 'error' && (
        <div className="absolute -top-4 right-0 text-2xl animate-bounce">?</div>
      )}
    </div>
  );
};

export default Mascot;