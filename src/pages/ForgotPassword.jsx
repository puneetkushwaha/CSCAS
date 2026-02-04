import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, Zap } from 'lucide-react';
import ngdPic from '../assets/images/ngd-pic.png';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const ForgotPassword = () => {
    // Parallax logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);
    const charX = useTransform(springX, [-300, 300], [-15, 15]);
    const charY = useTransform(springY, [-300, 300], [-15, 15]);

    const [ripples, setRipples] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [identifier, setIdentifier] = useState('');

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX - window.innerWidth / 2);
            mouseY.set(e.clientY - window.innerHeight / 2);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const handleCardClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setRipples(prev => [...prev, { x, y, id }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!identifier) {
            alert("Please enter your email or phone number");
            return;
        }

        setIsLoading(true);

        // Determine if input is email or phone
        const isEmail = identifier.includes("@");
        const payload = isEmail ? { email: identifier.trim() } : { phone: identifier.trim() };

        try {
            const res = await api.post('/auth/forgot-password', payload);
            alert(res.data.message || "Password sent successfully! Check your inbox/messages.");
        } catch (error) {
            console.error("Forgot Password Error:", error);
            const message = error.response?.data?.message || "Failed to process request.";
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen w-full bg-lh-dark text-white font-plus-jakarta flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center py-20 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onClick={handleCardClick}
                    className="max-w-[1000px] w-full bg-[#121212]/60 backdrop-blur-3xl border border-white/5 rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] grid lg:grid-cols-12 relative group cursor-crosshair"
                >
                    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                        <AnimatePresence>
                            {ripples.map(ripple => (
                                <motion.div
                                    key={ripple.id}
                                    initial={{ opacity: 0.6, scale: 0 }}
                                    animate={{ opacity: 0, scale: 4 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    style={{
                                        position: 'absolute',
                                        left: ripple.x, top: ripple.y,
                                        width: '100px', height: '100px',
                                        marginLeft: '-50px', marginTop: '-50px',
                                        borderRadius: '50%',
                                        background: 'radial-gradient(circle, rgba(188,19,254,0.4) 0%, rgba(188,19,254,0) 70%)',
                                        boxShadow: '0 0 20px rgba(188,19,254,0.2)'
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-lh-purple/[0.05] via-transparent to-lh-purple/[0.02] pointer-events-none"></div>

                    <div className="lg:col-span-5 hidden lg:flex items-center justify-center bg-black/20 border-r border-white/5 relative overflow-hidden p-8">
                        <div className="absolute inset-0 bg-lh-purple/10 blur-[100px] rounded-full scale-75 animate-pulse"></div>
                        <motion.div style={{ x: charX, y: charY }} className="relative z-10 w-full flex justify-center">
                            <motion.img
                                src={ngdPic}
                                alt="Cyber Character"
                                className="w-full max-w-[280px] h-auto drop-shadow-[0_0_30px_rgba(188,19,254,0.3)]"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </div>

                    <div className="lg:col-span-7 p-8 md:p-12">
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 relative z-10">
                            <motion.div variants={itemVariants} className="space-y-4">
                                <Link to="/login" className="inline-flex items-center gap-2 text-lh-purple text-[10px] font-black uppercase tracking-widest hover:text-white transition-all group/back">
                                    <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" /> Back to Login
                                </Link>
                                <div className="flex items-center gap-3">
                                    <Zap className="text-lh-purple" size={32} />
                                    <h1 className="text-3xl md:text-5xl font-[900] uppercase tracking-tighter">
                                        Forgot <span className="text-lh-purple">Password?</span>
                                    </h1>
                                </div>
                                <p className="text-gray-400 font-bold text-xs tracking-wide border-l-2 border-lh-purple pl-4 uppercase">
                                    Enter your details to receive a new password.
                                </p>
                            </motion.div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <motion.div variants={itemVariants} className="relative group/input">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="EMAIL OR MOBILE NUMBER"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-[11px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.03] transition-all placeholder:text-gray-700"
                                    />
                                </motion.div>

                                <motion.button
                                    variants={itemVariants}
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(188, 19, 254, 0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-lh-purple text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all relative overflow-hidden group/btn flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="relative z-10">Reset Password</span>}
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
