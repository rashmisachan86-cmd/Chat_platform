import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, PhoneOff, Video, Mic, MicOff, VideoOff } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CallPage() {
    const [searchParams] = useSearchParams();
    const callType = searchParams.get("type") || "video";

    const [isIncoming, setIsIncoming] = useState(true);
    const [isAccepted, setIsAccepted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(callType === "audio");
    const navigate = useNavigate();

    // Timer for call duration
    useEffect(() => {
        let interval: any;
        if (isAccepted) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isAccepted]);

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAccept = () => {
        setIsIncoming(false);
        setIsAccepted(true);
    };

    const handleEnd = () => {
        navigate('/chat');
    };

    return (
        <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center font-sans text-white">
            <AnimatedBackground />

            {/* Profile Avatar / Caller Info */}
            <div className="z-10 flex flex-col items-center gap-6 mb-20">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl font-bold shadow-2xl shadow-purple-500/50">
                        B
                    </div>
                    {isIncoming && (
                        <span className="absolute -inset-4 rounded-full border border-white/20 animate-ping opacity-20"></span>
                    )}
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Besties</h2>
                    <p className="text-white/50 text-lg mt-2 font-light">
                        {isIncoming
                            ? `Incoming ${callType.charAt(0).toUpperCase() + callType.slice(1)} Call...`
                            : isAccepted ? formatTime(duration) : "Connecting..."}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="z-10 flex items-center gap-8">
                {isIncoming ? (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleEnd}
                            className="p-6 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:bg-red-500 hover:text-white transition-all"
                        >
                            <PhoneOff size={32} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAccept}
                            className="p-6 rounded-full bg-green-500/20 text-green-400 border border-green-500/50 backdrop-blur-md shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:bg-green-500 hover:text-white transition-all animate-pulse"
                        >
                            <Phone size={32} />
                        </motion.button>
                    </>
                ) : (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMuted(!isMuted)}
                            className={`p-4 rounded-full border backdrop-blur-md transition-all ${isMuted ? 'bg-white text-black' : 'bg-white/10 text-white border-white/20'}`}
                        >
                            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleEnd}
                            className="p-6 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/40"
                        >
                            <PhoneOff size={32} />
                        </motion.button>

                        {callType === "video" && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsVideoOff(!isVideoOff)}
                                className={`p-4 rounded-full border backdrop-blur-md transition-all ${isVideoOff ? 'bg-white text-black' : 'bg-white/10 text-white border-white/20'}`}
                            >
                                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                            </motion.button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
