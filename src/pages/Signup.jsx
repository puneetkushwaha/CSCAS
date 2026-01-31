import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, ShieldCheck, CheckCircle, Fingerprint, Chrome } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import ngdPic from '../assets/images/ngd-pic.png';
import Navbar from '../components/Navbar';

const Signup = () => {
    // Parallax setup
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const [ripples, setRipples] = useState([]);

    const charX = useTransform(springX, [-300, 300], [-15, 15]);
    const charY = useTransform(springY, [-300, 300], [-15, 15]);

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
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 1000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen w-full bg-lh-dark text-white font-plus-jakarta flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center py-20 px-6">
                {/* Unified Premium Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onClick={handleCardClick}
                    className="max-w-[1100px] w-full bg-[#121212]/60 backdrop-blur-3xl border border-white/5 rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] grid lg:grid-cols-12 relative group cursor-crosshair"
                >
                    {/* Click Ripple Layer */}
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
                                        left: ripple.x,
                                        top: ripple.y,
                                        width: '100px',
                                        height: '100px',
                                        marginLeft: '-50px',
                                        marginTop: '-50px',
                                        borderRadius: '50%',
                                        background: 'radial-gradient(circle, rgba(188,19,254,0.4) 0%, rgba(188,19,254,0) 70%)',
                                        boxShadow: '0 0 20px rgba(188,19,254,0.2)'
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    {/* Animated Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-lh-purple/[0.05] via-transparent to-lh-purple/[0.02] pointer-events-none"></div>

                    {/* Left side: Signup Form */}
                    <div className="lg:col-span-7 p-8 md:p-12 order-2 lg:order-1">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6 relative z-10"
                        >
                            <motion.div variants={itemVariants} className="space-y-3">
                                <Link to="/" className="inline-flex items-center gap-2 text-lh-purple text-[10px] font-black uppercase tracking-widest hover:text-white transition-all group/back">
                                    <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" /> Back to Home
                                </Link>
                                <h1 className="text-3xl md:text-5xl font-[900] uppercase tracking-tighter text-white">
                                    Create <span className="text-lh-purple">Account</span>
                                </h1>
                                <p className="text-gray-400 font-bold text-[10px] tracking-wide border-l-2 border-lh-purple pl-4">
                                    Fill in the details to join our network.
                                </p>
                            </motion.div>

                            <form className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <motion.div variants={itemVariants} className="relative group/input">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                        <input
                                            type="text"
                                            placeholder="FULL NAME"
                                            className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700"
                                        />
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="relative group/input">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                        <input
                                            type="email"
                                            placeholder="EMAIL ADDRESS"
                                            className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700"
                                        />
                                    </motion.div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <motion.div variants={itemVariants} className="relative group/input">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                        <input
                                            type="password"
                                            placeholder="PASSWORD"
                                            className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700"
                                        />
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="relative group/input">
                                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                        <input
                                            type="password"
                                            placeholder="CONFIRM PASSWORD"
                                            className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700"
                                        />
                                    </motion.div>
                                </div>

                                <motion.label variants={itemVariants} className="flex items-start gap-3 cursor-pointer group/check py-1">
                                    <input type="checkbox" className="hidden peer" />
                                    <div className="w-5 h-5 border-2 border-white/10 rounded-lg flex items-center justify-center peer-checked:bg-lh-purple peer-checked:border-lh-purple transition-all group-hover/check:border-lh-purple/40 shrink-0 mt-0.5">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                    </div>
                                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                                        I accept the <a href="#" className="underline text-lh-purple hover:text-white transition-colors">Terms of Service</a> and <a href="#" className="underline text-lh-purple hover:text-white transition-colors">Privacy Policy</a>.
                                    </span>
                                </motion.label>

                                <motion.button
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(188, 19, 254, 0.3)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-lh-purple text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all relative overflow-hidden group/btn mt-2 shadow-xl"
                                >
                                    <span className="relative z-10">Sign Up</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                </motion.button>
                            </form>

                            <motion.div variants={itemVariants} className="relative flex items-center gap-4 py-1">
                                <div className="flex-1 h-[1px] bg-white/5"></div>
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Or continue with</span>
                                <div className="flex-1 h-[1px] bg-white/5"></div>
                            </motion.div>

                            <div className="space-y-4">
                                <motion.button variants={itemVariants} className="w-full flex items-center justify-center gap-3 bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 py-3 rounded-xl transition-all group/social">
                                    <Chrome size={18} className="text-gray-400 group-hover/social:text-white" />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none pt-1">Continue with Google</span>
                                </motion.button>
                            </div>

                            <motion.p variants={itemVariants} className="text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] pt-2">
                                Already have an account? <Link to="/login" className="text-lh-purple hover:text-white transition-colors underline underline-offset-4">Login</Link>
                            </motion.p>
                        </motion.div>
                    </div>

                    {/* Right side: Character (Now inside border) */}
                    <div className="lg:col-span-5 hidden lg:flex items-center justify-center bg-black/20 border-l border-white/5 relative overflow-hidden p-8 order-1 lg:order-2">
                        <div className="absolute inset-0 bg-lh-purple/15 blur-[100px] rounded-full scale-110 animate-pulse"></div>

                        <motion.div
                            style={{ x: charX, y: charY }}
                            className="relative z-10 w-full flex justify-center"
                        >
                            <motion.img
                                src={ngdPic}
                                alt="Cyber Character"
                                className="w-full max-w-[280px] h-auto grayscale-[0.2] hover:grayscale-0 transition-all duration-700 drop-shadow-[0_0_30px_rgba(188,19,254,0.3)]"
                                animate={{
                                    y: [0, 10, 0],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
