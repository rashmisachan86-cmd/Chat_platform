import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Mascot from '../components/Mascot';
import TechBackground from '../components/TechBackground';
import { ArrowLeft, User, Lock, ArrowRight, Zap, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isGirl, isBoy } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusField, setFocusField] = useState<'username' | 'password' | null>(null);
  const { login, isLoading, error } = useAuth();

  const getMascotState = () => {
    if (error) return 'error';
    if (focusField === 'password') return 'focus';
    return 'idle';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    await login(username, password);
    // Navigation will be handled by auth hook or elsewhere
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-background transition-colors duration-700 p-6">
      {/* Background Effects */}
      {isBoy && <TechBackground />}
      {isGirl && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 60 + 20,
                height: Math.random() * 60 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, rgba(255, 182, 193, ${Math.random() * 0.3}) 0%, transparent 70%)`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <Link to="/landing" className="absolute top-8 left-8 p-3 rounded-full bg-card hover:bg-accent/10 transition-all z-20 border border-border shadow-lg group">
        <ArrowLeft className="w-5 h-5 text-foreground group-hover:-translate-x-1 transition-transform" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="w-full max-w-md relative z-10"
      >

        {/* Header Section */}
        <div className="text-center mb-8 relative">
          {isGirl && (
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.6 }}
            >
              <Mascot state={getMascotState()} />
            </motion.div>
          )}
          {isBoy && (
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            >
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/50 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Zap className="w-10 h-10 text-primary" />
              </div>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-black text-foreground mb-3"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            Sign in to continue to God X
          </motion.p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={`
          relative backdrop-blur-xl border-2 p-10 shadow-2xl
          ${isGirl ? 'bg-white/80 border-pink-200/50 rounded-[2.5rem]' : 'bg-card/60 border-border rounded-2xl'}
        `}>
          {/* Glow Effect */}
          {isBoy && (
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl opacity-20 blur-xl"
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}

          <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 text-sm text-red-500 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-center font-semibold"
              >
                {error}
              </motion.div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground ml-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Username
              </label>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <User className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusField('username')}
                  onBlur={() => setFocusField(null)}
                  className={`
                    w-full pl-14 pr-5 py-4 bg-input border-2 text-foreground placeholder:text-muted-foreground outline-none transition-all
                    ${focusField === 'username'
                      ? (isGirl ? 'border-pink-400 shadow-lg shadow-pink-200/50' : 'border-primary shadow-lg shadow-primary/20')
                      : 'border-transparent hover:border-border/50'
                    }
                    ${isGirl ? 'rounded-2xl' : 'rounded-xl'}
                  `}
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground ml-2 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password
              </label>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField(null)}
                  className={`
                    w-full pl-14 pr-14 py-4 bg-input border-2 text-foreground placeholder:text-muted-foreground outline-none transition-all
                    ${focusField === 'password'
                      ? (isGirl ? 'border-pink-400 shadow-lg shadow-pink-200/50' : 'border-primary shadow-lg shadow-primary/20')
                      : 'border-transparent hover:border-border/50'
                    }
                    ${isGirl ? 'rounded-2xl' : 'rounded-xl'}
                  `}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || !username || !password}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full py-5 text-white font-bold text-lg tracking-wide shadow-2xl relative overflow-hidden group transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                ${isGirl
                  ? 'rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:shadow-pink-500/50'
                  : 'rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:shadow-primary/50'
                }
              `}
            >
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 0.2, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    {isGirl && <Sparkles className="w-5 h-5" />}
                    LOGIN
                    {isBoy && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                  </>
                )}
              </span>
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center space-y-4"
        >
          <p className="text-muted-foreground text-lg">
            New to God X?{' '}
            <Link
              to="/signup"
              className={`font-bold hover:underline decoration-2 underline-offset-4 transition-all ${
                isGirl ? 'text-pink-500 hover:text-pink-600' : 'text-primary hover:text-primary/80'
              }`}
            >
              Create Account
            </Link>
          </p>
          <button
            className={`text-sm font-semibold ${
              isGirl ? 'text-pink-400 hover:text-pink-500' : 'text-purple-400 hover:text-purple-500'
            } transition-colors`}
          >
            Forgot Password?
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Login;