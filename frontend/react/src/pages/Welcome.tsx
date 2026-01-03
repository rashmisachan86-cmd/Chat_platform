import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Zap, ArrowRight, Music, Heart, Moon, Sun } from 'lucide-react';
import { Gender, Vibe } from '../types/theme';

const Welcome: React.FC = () => {
  const { setGender, setVibe } = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState<'gender' | 'vibe'>('gender');
  const [tempGender, setTempGender] = useState<Gender>(null);

  const handleGenderSelect = (gender: Gender) => {
    setTempGender(gender);
    setGender(gender); // Apply instantly for morph effect
    
    if (gender === 'girl') {
      // Girl mode has vibe check
      setTimeout(() => setStep('vibe'), 600);
    } else {
      // Boy mode goes straight to login
      setTimeout(() => navigate('/login'), 800);
    }
  };

  const handleVibeSelect = (vibe: Vibe) => {
    setVibe(vibe);
    navigate('/login');
  };

  if (step === 'vibe' && tempGender === 'girl') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500 bg-gradient-to-br from-background via-secondary/30 to-background">
        <h2 className="text-3xl font-bold mb-8 text-foreground text-center">
          Choose your vibe
        </h2>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {[
            { id: 'soft', label: 'Soft', icon: <Heart className="w-6 h-6" /> },
            { id: 'elegant', label: 'Elegant', icon: <Sparkles className="w-6 h-6" /> },
            { id: 'cute', label: 'Cute', icon: <Sun className="w-6 h-6" /> },
            { id: 'calm', label: 'Calm', icon: <Moon className="w-6 h-6" /> }
          ].map((vibeItem) => (
            <button
              key={vibeItem.id}
              onClick={() => handleVibeSelect(vibeItem.id as Vibe)}
              className="group flex flex-col items-center justify-center p-6 bg-card border border-border rounded-var shadow-custom hover:border-primary hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div className="mb-3 text-primary group-hover:scale-110 transition-transform">
                {vibeItem.icon}
              </div>
              <span className="font-medium text-foreground">{vibeItem.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-background transition-colors duration-1000">
      {/* Intro Header */}
      <div className="absolute top-10 left-0 right-0 z-20 text-center pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-black text-foreground/10 tracking-[0.5em] uppercase">
          GodX
        </h1>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <span className="bg-background text-foreground px-4 py-2 font-bold tracking-widest text-sm uppercase rounded-full border border-border shadow-custom">
          Who are you?
        </span>
      </div>

      {/* Girl Selection Area */}
      <div 
        className="relative flex-1 group cursor-pointer border-b md:border-b-0 md:border-r border-border/10 transition-all duration-700 hover:flex-[1.5]"
        onClick={() => handleGenderSelect('girl')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(255,240,245)] to-[rgb(255,250,250)] opacity-100 group-hover:opacity-90 transition-opacity"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 z-10">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/50 backdrop-blur-md shadow-[0_0_40px_rgba(255,182,193,0.3)] flex items-center justify-center mb-8 transform group-hover:scale-110 transition-all duration-500 animate-float">
            <Sparkles className="w-12 h-12 text-[rgb(255,182,193)]" />
          </div>
          <h3 className="text-3xl font-light text-[rgb(90,70,90)] mb-2 tracking-wide">She</h3>
          <p className="text-[rgb(160,140,160)] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            Soft, Elegant, Intuitive
          </p>
        </div>
      </div>

      {/* Boy Selection Area */}
      <div 
        className="relative flex-1 group cursor-pointer transition-all duration-700 hover:flex-[1.5]"
        onClick={() => handleGenderSelect('boy')}
      >
        <div className="absolute inset-0 bg-gradient-to-tl from-[rgb(10,12,18)] to-[rgb(20,25,35)]"></div>
        
        {/* Abstract Tech Patterns */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[rgb(0,122,255)] via-transparent to-transparent group-hover:opacity-40 transition-opacity"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 z-10">
           <div className="w-32 h-32 md:w-48 md:h-48 relative mb-8 transform group-hover:scale-110 transition-all duration-500">
              <div className="absolute inset-0 border-2 border-[rgb(0,122,255)] opacity-30 rotate-45"></div>
              <div className="absolute inset-0 border-2 border-[rgb(220,20,60)] opacity-30 -rotate-12 translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Zap className="w-12 h-12 text-[rgb(0,122,255)] drop-shadow-[0_0_10px_rgba(0,122,255,0.8)]" />
              </div>
           </div>
          <h3 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter">He</h3>
          <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 text-center">
            Bold, Dynamic, Limitless
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;