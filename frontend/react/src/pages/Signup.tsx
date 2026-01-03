import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Mascot from '../components/Mascot';
import TechBackground from '../components/TechBackground';
import { ArrowLeft, User, Lock, ShieldCheck, ArrowRight, Zap, Target } from 'lucide-react';

const Signup: React.FC = () => {
  const { isGirl, isBoy } = useTheme();
  const [focusField, setFocusField] = useState<'username' | 'password' | 'confirm' | null>(null);

  const getMascotState = () => {
    if (focusField === 'password' || focusField === 'confirm') return 'focus';
    return 'idle';
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-background transition-colors duration-700 p-6">
      {isBoy && <TechBackground />}

      <Link to="/" className="absolute top-8 left-8 p-2 rounded-full bg-card hover:bg-accent/10 transition-colors z-20 border border-border">
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </Link>
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          {isGirl && (
            <div className="mb-6 flex justify-center">
               <Mascot state={getMascotState()} />
            </div>
          )}
          {isBoy && (
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/50 relative overflow-hidden">
                 <Target className="w-10 h-10 text-primary animate-[spin_10s_linear_infinite]" />
              </div>
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-foreground mb-2">Join GodX</h1>
          <p className="text-muted-foreground">Private. Personal. Yours.</p>
        </div>

        {/* Form Container */}
        <div className={`
          relative bg-card backdrop-blur-xl border border-border p-8 shadow-custom
          ${isGirl ? 'rounded-[2rem]' : 'rounded-lg'}
        `}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Alias</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Choose your username"
                  onFocus={() => setFocusField('username')}
                  onBlur={() => setFocusField(null)}
                  className={`
                    w-full pl-12 pr-4 py-4 bg-input border-2 border-transparent text-foreground placeholder:text-muted-foreground outline-none transition-all
                    focus:border-primary/50 focus:shadow-[0_0_20px_var(--shadow-color)]
                    ${isGirl ? 'rounded-2xl' : 'rounded-md'}
                  `}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="password"
                  placeholder="Create password"
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField(null)}
                  className={`
                    w-full pl-12 pr-4 py-4 bg-input border-2 border-transparent text-foreground placeholder:text-muted-foreground outline-none transition-all
                    focus:border-primary/50 focus:shadow-[0_0_20px_var(--shadow-color)]
                    ${isGirl ? 'rounded-2xl' : 'rounded-md'}
                  `}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Confirm</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="password"
                  placeholder="Repeat password"
                  onFocus={() => setFocusField('confirm')}
                  onBlur={() => setFocusField(null)}
                  className={`
                    w-full pl-12 pr-4 py-4 bg-input border-2 border-transparent text-foreground placeholder:text-muted-foreground outline-none transition-all
                    focus:border-primary/50 focus:shadow-[0_0_20px_var(--shadow-color)]
                    ${isGirl ? 'rounded-2xl' : 'rounded-md'}
                  `}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`
                w-full mt-4 py-4 text-primary-foreground font-bold text-lg tracking-wide shadow-custom relative overflow-hidden group transition-all transform active:scale-95
                ${isGirl ? 'rounded-2xl bg-gradient-to-r from-primary to-[rgb(255,200,210)] hover:brightness-105' : 'rounded-md bg-primary hover:bg-primary/90'}
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                SIGN UP {isBoy && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
              {isBoy && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:skew-x-12 group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <p className="text-muted-foreground">
            Already have an ID?{' '}
            <Link 
              to="/login" 
              className={`font-semibold hover:underline decoration-2 underline-offset-4 ${isGirl ? 'text-primary' : 'text-primary'}`}
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;