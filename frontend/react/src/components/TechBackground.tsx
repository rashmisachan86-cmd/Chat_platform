import React from 'react';

const TechBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 122, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 122, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Dynamic particles / floating elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/20 rounded-full animate-float opacity-30" />
      <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border-2 border-primary/30 rotate-45 animate-pulse opacity-40" />
      
      {/* Glowing orbs */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-destructive/5 rounded-full blur-3xl" />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-4 w-full animate-[scan_4s_ease-in-out_infinite]" />
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TechBackground;