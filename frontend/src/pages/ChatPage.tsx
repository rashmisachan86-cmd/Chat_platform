import React, { useEffect, useState, useRef } from "react";
import api from "../lib/api.js";
import { socket, connectSocket, joinChat } from "../lib/socket.js";
import {
  FiLogOut, FiSend, FiMessageSquare, FiSmile, FiSettings,
  FiVideo, FiPhone, FiMic, FiPaperclip, FiSearch, FiX, FiStar,
  FiCornerUpLeft, FiTrash2, FiClock, FiCheck, FiCheckCircle
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { useNavigate } from "react-router-dom";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';
import { ProfileModal } from "../components/ProfileModal";
import { GroupDetails } from "../components/GroupDetails";
import { MediaPreview } from "../components/MediaPreview";
import { SoundEngine } from "../lib/sounds";
import { useTheme } from "../context/ThemeContext";
import { StatusStories } from "../components/StatusStories";
import { ParticleEffect } from "../components/ParticleEffect";
import { UserSearchModal } from "../components/UserSearchModal";

// Variants for staggered entry
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function ChatPage() {
  const [convs, setConvs] = useState<any[]>([]);
  const [active, setActive] = useState<string | undefined>();
  const [msgs, setMsgs] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // God-Level State
  const [replyTo, setReplyTo] = useState<any | null>(null);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [particleType, setParticleType] = useState<'confetti' | 'fire' | null>(null);

  // User state
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const { soundsEnabled, accentColor, chatWallpaper } = useTheme();
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser._id) {
      nav('/login');
      return;
    }

    connectSocket(currentUser._id);

    async function load() {
      try {
        const { data } = await api.get('/conversations');
        setConvs(data);
        if (data.length > 0 && !active) {
          setActive(data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    }
    load();

    // Socket Listeners
    socket.on('message_received', (newMsg) => {
      if (newMsg.conversation === active) {
        setMsgs(prev => [...prev, { ...newMsg, mine: newMsg.from._id === currentUser._id }]);
        scrollToBottom();
        playSound('pop');
      }
      // Update last message in sidebar
      setConvs(prev => prev.map(c => c._id === newMsg.conversation ? { ...c, lastMessage: newMsg.text } : c));
    });

    socket.on('typing', (data) => {
      if (data.chatId === active) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socket.off('message_received');
      socket.off('typing');
    };
  }, [active]);

  useEffect(() => {
    if (active) {
      joinChat(active);
      api.get(`/messages/${active}`).then(({ data }) => {
        const safeMsgs = data.map((m: any) => ({
          ...m,
          mine: m.from?._id === currentUser._id || m.from === currentUser._id
        }));
        setMsgs(safeMsgs);
        scrollToBottom();
      });
    }
  }, [active]);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  const playSound = (type: 'sent' | 'pop') => {
    if (soundsEnabled) {
      if (type === 'sent') SoundEngine.playSent();
      else SoundEngine.playPop();
    }
  };

  // Simulate typing indicator from peer
  useEffect(() => {
    if (active && msgs.length > 0) {
      const lastMsg = msgs[msgs.length - 1];
      if (lastMsg.mine) {
        const timeoutType = setTimeout(() => setIsTyping(true), 1000);
        const timeoutEnd = setTimeout(() => setIsTyping(false), 4000);
        return () => { clearTimeout(timeoutType); clearTimeout(timeoutEnd); };
      }
    }
  }, [msgs, active]);

  // Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => sendMediaMessage('audio', reader.result as string);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isRecording) interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatRecTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => sendMediaMessage('image', reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  async function sendMediaMessage(type: 'image' | 'audio', url: string) {
    if (!active) return;
    const { data } = await api.post('/messages', {
      conversationId: active,
      type,
      contentUrl: url,
      isSecret: isSecretMode
    });

    setMsgs(prev => [...prev, { ...data, mine: true }]);
    scrollToBottom();
    playSound('sent');

    // Broadcast message via socket for instant UI update on peer
    socket.emit('new_message', data);
  }

  async function onSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!active || !input.trim()) return;
    const text = input;
    setInput("");
    setShowEmoji(false);
    playSound('sent');

    if (text.toLowerCase().includes('congrat')) setParticleType('confetti');
    if (text.toLowerCase().includes('fire')) setParticleType('fire');

    try {
      const { data } = await api.post('/messages', {
        conversationId: active,
        text,
        type: 'text',
        replyTo: replyTo?._id,
        isSecret: isSecretMode
      });

      setMsgs(prev => [...prev, { ...data, mine: true }]);
      setReplyTo(null);
      scrollToBottom();

      socket.emit('new_message', data);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    nav('/login');
  };

  const toggleReaction = (msgId: string) => {
    setMsgs(prev => prev.map(msg => {
      if (msg.id === msgId) {
        const hasReaction = msg.reactions?.includes('❤️');
        if (!hasReaction) playSound('pop');
        return { ...msg, reactions: hasReaction ? [] : ['❤️'] };
      }
      return msg;
    }));
  };

  const toggleStar = (msgId: string) => {
    setMsgs(prev => prev.map(m => m.id === msgId ? { ...m, isStarred: !m.isStarred } : m));
  };

  const deleteMsg = (msgId: string) => {
    setMsgs(prev => prev.filter(m => m.id !== msgId));
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredMsgs = msgs.filter(m => {
    if (!searchQuery) return true;
    return m.text?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="relative flex h-screen w-full overflow-hidden font-sans text-white">
      <AnimatedBackground />
      <ParticleEffect type={particleType} onComplete={() => setParticleType(null)} />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <GroupDetails
        isOpen={showGroupInfo}
        onClose={() => setShowGroupInfo(false)}
        conversation={convs.find(c => c._id === active)}
      />

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <div className="z-10 flex w-full h-full max-w-[1700px] mx-auto p-4 md:p-6 gap-6">
        <motion.aside
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex flex-col w-96 glass-premium rounded-[2.5rem] overflow-hidden"
        >
          <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xl font-black shadow-lg">G</div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">GodX Pro</h2>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Encrypted</span>
                </div>
              </div>
            </motion.div>
            <div className="flex items-center gap-2">
              <UserSearchModal onChatCreated={(id) => {
                setActive(id);
                // Refresh conversations list
                api.get('/conversations').then(({ data }) => setConvs(data));
              }} />
              <button
                onClick={() => setShowProfileModal(true)}
                className="p-3 rounded-2xl hover:bg-white/10 text-white/50 hover:text-white transition-all hover:scale-110 active:scale-95 bg-white/5 border border-white/5"
              >
                <FiSettings />
              </button>
            </div>
          </div>

          <StatusStories />

          <motion.div variants={itemVariants} className="p-4">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder-white/10"
              />
            </div>
          </motion.div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 rounded-3xl flex items-center gap-4 border border-transparent">
                  <div className="w-14 h-14 rounded-2xl skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 skeleton rounded-full" />
                    <div className="h-3 w-32 skeleton rounded-full opacity-50" />
                  </div>
                </div>
              ))
            ) : (
              convs.map(c => (
                <motion.button
                  variants={itemVariants}
                  key={c._id}
                  onClick={() => setActive(c._id)}
                  className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all group relative overflow-hidden ${active === c._id
                    ? 'bg-white/10 border border-white/10 shadow-xl'
                    : 'hover:bg-white/5 border border-transparent'
                    }`}
                >
                  {active === c._id && <motion.div layoutId="navGlow" className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 pointer-events-none" />}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-2xl transform transition-transform group-hover:scale-105 ${active === c._id ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white' : 'bg-white/5 text-white/20'}`}>
                    {c.title.charAt(0)}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold truncate text-white/90 group-hover:text-white">{c.title}</h4>
                      <span className="text-[10px] text-white/20">12:45</span>
                    </div>
                    <p className="text-xs text-white/30 truncate group-hover:text-white/50">{c.lastMessage || 'Start a conversation...'}</p>
                  </div>
                </motion.button>
              ))
            )}
          </div>

          <div className="p-6 border-t border-white/5 bg-black/20">
            <button onClick={handleLogout} className="flex items-center justify-center gap-3 text-white/30 hover:text-red-400 transition-all w-full py-4 rounded-2xl hover:bg-red-500/5 group border border-transparent hover:border-red-500/20">
              <FiLogOut className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-xs font-bold uppercase tracking-widest">Secure Exit</span>
            </button>
          </div>
        </motion.aside>

        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex-1 flex flex-col glass-premium rounded-[2.5rem] overflow-hidden relative"
        >
          <div className={`absolute inset-0 pointer-events-none opacity-20 ${chatWallpaper === 'dots' ? 'wallpaper-dots' : chatWallpaper === 'grid' ? 'wallpaper-grid' : ''}`} />

          {!active ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/10 relative z-10">
              <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                <FiMessageSquare size={48} />
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.2em]">Select an encrypted channel</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="h-24 px-8 border-b border-white/5 bg-white/5 flex items-center justify-between backdrop-blur-3xl z-20">
                <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setShowGroupInfo(true)}>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                    {convs.find(c => c._id === active)?.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">
                      {convs.find(c => c._id === active)?.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-emerald-400/80 uppercase font-black tracking-widest">Live Now</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <AnimatePresence>
                    {showSearch && (
                      <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search Intel..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-purple-500/50 backdrop-blur-xl"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button onClick={() => setShowSearch(!showSearch)} className={`p-3 rounded-2xl transition-all ${showSearch ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                    <FiSearch size={22} />
                  </button>
                  <div className="h-10 w-px bg-white/5 mx-2" />
                  <button onClick={() => nav('/call?type=audio')} className="p-3 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all hover:scale-110"><FiPhone size={22} /></button>
                  <button onClick={() => nav('/call?type=video')} className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition-all hover:scale-110 shadow-lg shadow-purple-500/10"><FiVideo size={22} /></button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar relative z-10">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'items-end' : 'items-start'}`}>
                      <div className={`h-16 w-64 skeleton rounded-3xl ${i % 2 === 0 ? 'rounded-tr-sm' : 'rounded-tl-sm'}`} />
                      <div className="h-2 w-16 skeleton rounded-full mt-2 opacity-30" />
                    </div>
                  ))
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredMsgs.map((m) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        key={m._id}
                        className={`flex flex-col ${m.mine ? 'items-end' : 'items-start'}`}
                      >
                        {m.replyTo && (
                          <div className="mb-1 px-4 py-2 bg-white/5 border-l-4 border-purple-500 rounded-lg text-xs text-white/40 max-w-[50%] truncate flex items-center gap-2">
                            <FiCornerUpLeft size={10} />
                            Context: {msgs.find(rm => rm._id === m.replyTo)?.text || 'Media Message'}
                          </div>
                        )}

                        <div className="relative group/msg flex items-center gap-3">
                          {!m.mine && (
                            <button onClick={() => setReplyTo(m)} className="opacity-0 group-hover/msg:opacity-100 p-2 bg-white/5 rounded-full hover:bg-purple-500 text-white/40 hover:text-white transition-opacity"><FiCornerUpLeft size={14} /></button>
                          )}

                          <div className={`
                            max-w-[80%] px-6 py-4 rounded-[2rem] text-sm leading-relaxed relative
                            ${m.mine
                              ? `bg-gradient-to-br from-purple-600 to-blue-700 text-white rounded-tr-sm shadow-2xl shadow-purple-900/30 font-medium ${m.isSecret ? 'ghost-glitch' : ''}`
                              : `bg-white/5 text-white/90 rounded-tl-sm border border-white/10 backdrop-blur-xl shadow-xl ${m.isSecret ? 'ghost-glitch' : ''}`}
                            ${m.isSecret && !m.mine ? 'animate-burn' : ''}
                          `} onDoubleClick={() => toggleReaction(m.id)}>
                            {m.type === 'text' && m.text}
                            {(m.type === 'image' || m.type === 'audio') && m.contentUrl && <MediaPreview type={m.type} url={m.contentUrl} />}

                            <div className={`text-[9px] mt-2 flex items-center gap-2 uppercase tracking-widest font-bold ${m.mine ? 'justify-end text-white/60' : 'justify-start text-white/30'}`}>
                              {formatTime(m.ts)}
                              {m.mine && (
                                <span className="flex items-center">
                                  {m.status === 'sent' ? <FiCheck size={10} /> : <FiCheckCircle size={10} className="text-blue-400" />}
                                </span>
                              )}
                              {m.isStarred && <FiStar size={10} className="text-yellow-400 fill-yellow-400" />}
                            </div>

                            {m.reactions && m.reactions.length > 0 && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -bottom-3 -right-3 bg-white/10 border border-white/20 backdrop-blur-xl rounded-full p-1.5 text-xs shadow-xl">
                                {m.reactions.join('')}
                              </motion.div>
                            )}
                          </div>

                          {m.mine && (
                            <div className="flex flex-col gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                              <button onClick={() => toggleStar(m.id)} className={`p-2 rounded-full bg-white/5 hover:bg-yellow-500 text-white/40 hover:text-white ${m.isStarred ? 'text-yellow-400' : ''}`}><FiStar size={14} /></button>
                              <button onClick={() => deleteMsg(m.id)} className="p-2 rounded-full bg-white/5 hover:bg-red-500 text-white/40 hover:text-white"><FiTrash2 size={14} /></button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start px-4">
                    <div className="bg-white/5 border border-white/5 rounded-3xl rounded-tl-sm px-6 py-3 flex gap-2 items-center">
                      {[0, 0.2, 0.4].map(delay => <div key={delay} className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />)}
                    </div>
                  </motion.div>
                )}
                <div ref={scrollRef} className="h-4" />
              </div>

              {/* Input Area */}
              <div className="p-8 bg-gradient-to-t from-[#13111C] to-transparent relative z-20">
                <AnimatePresence>
                  {replyTo && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="absolute bottom-32 left-8 right-8 p-4 bg-[#1a1b26]/90 border border-white/10 rounded-2xl backdrop-blur-2xl flex items-center justify-between shadow-2xl">
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <FiCornerUpLeft className="text-purple-400" />
                        <span>Replying to {replyTo.mine ? 'Yourself' : replyTo.from}: <span className="text-white/40 italic">{replyTo.text || 'Media'}</span></span>
                      </div>
                      <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-white/10 rounded-full"><FiX /></button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative flex items-center gap-4">
                  <div className="flex gap-2">
                    <button type="button" onClick={handleFileClick} className="p-4 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all bg-white/5 border border-white/5"><FiPaperclip size={24} /></button>
                    <button onClick={() => setShowEmoji(!showEmoji)} className={`p-4 rounded-2xl transition-all border border-white/5 ${showEmoji ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}><FiSmile size={24} /></button>
                  </div>

                  {isRecording ? (
                    <div className="flex-1 bg-red-500/10 border border-red-500/30 rounded-[2rem] px-8 py-4 flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                        <span className="text-sm font-bold text-red-400 font-mono">{formatRecTime(recordingTime)}</span>
                        <div className="h-8 flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <motion.div key={i} animate={{ height: [8, 30, 8] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }} className="w-1 bg-red-500/40 rounded-full" />)}
                        </div>
                      </div>
                      <button onClick={stopRecording} className="px-6 py-2 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Stop & Send</button>
                    </div>
                  ) : (
                    <form onSubmit={onSend} className="flex-1 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <input
                          type="text" value={input} onChange={(e) => setInput(e.target.value)}
                          placeholder={isSecretMode ? "Ghost Mode Active..." : "Channel your thoughts..."}
                          className={`w-full bg-white/5 border rounded-[2rem] px-8 py-5 text-white placeholder-white/20 focus:outline-none transition-all shadow-inner backdrop-blur-xl ${isSecretMode ? 'border-red-500/30 text-red-200 ghost-glitch' : 'border-white/10 focus:border-purple-500/50'}`}
                        />
                        <button type="button" onClick={() => setIsSecretMode(!isSecretMode)} className={`absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isSecretMode ? 'bg-red-500 text-white shadow-lg' : 'text-white/20 hover:text-white'}`} title="Secret Mode (Self-Destruct)"><FiClock size={16} /></button>
                      </div>
                      {input.trim() ? (
                        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} type="submit" style={{ backgroundColor: accentColor }} className="p-5 rounded-[2rem] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all"><FiSend size={24} /></motion.button>
                      ) : (
                        <button type="button" onClick={startRecording} className="p-5 rounded-[2rem] bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all border border-white/5"><FiMic size={24} /></button>
                      )}
                    </form>
                  )}
                </div>
                <AnimatePresence>
                  {showEmoji && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-32 left-8 z-30 shadow-2xl rounded-3xl overflow-hidden border border-white/10">
                      <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} width={350} height={400} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
