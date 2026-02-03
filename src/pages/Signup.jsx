import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, ShieldCheck, Chrome, Eye, EyeOff, Loader2 } from 'lucide-react';
import ngdPic from '../assets/images/ngd-pic.png';
import Navbar from '../components/Navbar';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Signup = () => {
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
    const [showPassword, setShowPassword] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState(null);
    const [identifier, setIdentifier] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

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

    const socialLogin = (provider) => {
        window.location.href = `${BASE_URL}/api/auth/${provider}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !identifier || !formData.password) {
            alert("All fields are required");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setIsLoading(true);

        const isEmail = identifier.includes("@");
        const payload = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            password: formData.password,
            identifier: identifier.trim(),
            ...(isEmail ? { email: identifier.trim() } : { phone: identifier.trim() })
        };

        try {
            const res = await fetch(`${BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            const extractedUserId = data.userId || data.id || (data.user && data.user._id) || data._id;
            setUserId(extractedUserId);
            setShowOtp(true);
        } catch (error) {
            console.error("Signup error:", error);
            alert("Server error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, otp }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "OTP verification failed");
                return;
            }
            navigate("/login");
        } catch (error) {
            console.error(error);
            alert("Server error");
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
                    className="max-w-[1100px] w-full bg-[#121212]/60 backdrop-blur-3xl border border-white/5 rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] grid lg:grid-cols-12 relative group cursor-crosshair"
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

                    <div className="lg:col-span-7 p-8 md:p-12 order-2 lg:order-1">
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 relative z-10">
                            <motion.div variants={itemVariants} className="space-y-3">
                                <Link to="/" className="inline-flex items-center gap-2 text-lh-purple text-[10px] font-black uppercase tracking-widest hover:text-white transition-all group/back">
                                    <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" /> Back to Home
                                </Link>
                                <h1 className="text-3xl md:text-5xl font-[900] uppercase tracking-tighter text-white">
                                    {!showOtp ? <>Create <span className="text-lh-purple">Account</span></> : <>Verify <span className="text-lh-purple">Identity</span></>}
                                </h1>
                                <p className="text-gray-400 font-bold text-[10px] tracking-wide border-l-2 border-lh-purple pl-4 uppercase">
                                    {!showOtp ? "Fill in the details to join our network." : "Please enter the authentication code sent to you."}
                                </p>
                            </motion.div>

                            {!showOtp ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <motion.div variants={itemVariants} className="relative group/input">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                            <input
                                                type="text"
                                                required
                                                placeholder="FIRST NAME"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700"
                                            />
                                        </motion.div>
                                        <motion.div variants={itemVariants} className="relative group/input">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                            <input
                                                type="text"
                                                required
                                                placeholder="LAST NAME"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700"
                                            />
                                        </motion.div>
                                    </div>

                                    <motion.div variants={itemVariants} className="relative group/input">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="EMAIL OR MOBILE NUMBER"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700"
                                        />
                                    </motion.div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <motion.div variants={itemVariants} className="relative group/input">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                placeholder="PASSWORD"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-[10px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </motion.div>
                                        <motion.div variants={itemVariants} className="relative group/input">
                                            <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                            <input
                                                type="password"
                                                required
                                                placeholder="CONFIRM PASSWORD"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700"
                                            />
                                        </motion.div>
                                    </div>

                                    <motion.button
                                        variants={itemVariants}
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(188, 19, 254, 0.3)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-lh-purple text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all relative overflow-hidden group/btn mt-2 shadow-xl flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="relative z-10">Sign Up</span>}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                    </motion.button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-6">
                                    <motion.div variants={itemVariants} className="relative group/input">
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            placeholder="ENTER 6-DIGIT OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full bg-black/60 border border-white/10 rounded-2xl py-6 text-center text-xl font-black tracking-[0.5em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700 placeholder:text-[10px] placeholder:tracking-[0.2em]"
                                        />
                                    </motion.div>

                                    <motion.button
                                        variants={itemVariants}
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(188, 19, 254, 0.3)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-lh-purple text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all relative overflow-hidden group/btn shadow-xl flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="relative z-10">Verify Identity</span>}
                                    </motion.button>

                                    <button
                                        type="button"
                                        onClick={() => setShowOtp(false)}
                                        className="w-full text-center text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                                    >
                                        Back to Registration
                                    </button>
                                </form>
                            )}

                            {!showOtp && (
                                <>
                                    <motion.div variants={itemVariants} className="relative flex items-center gap-4 py-1">
                                        <div className="flex-1 h-[1px] bg-white/5"></div>
                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Or continue with</span>
                                        <div className="flex-1 h-[1px] bg-white/5"></div>
                                    </motion.div>

                                    <div className="space-y-4">
                                        <motion.button
                                            variants={itemVariants}
                                            onClick={() => socialLogin("google")}
                                            className="w-full flex items-center justify-center gap-3 bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 py-3 rounded-xl transition-all group/social"
                                        >
                                            <Chrome size={18} className="text-gray-400 group-hover/social:text-white" />
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none pt-1">Continue with Google</span>
                                        </motion.button>
                                    </div>
                                </>
                            )}

                            <motion.p variants={itemVariants} className="text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] pt-2">
                                Already have an account? <Link to="/login" className="text-lh-purple hover:text-white transition-colors underline underline-offset-4">Login</Link>
                            </motion.p>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5 hidden lg:flex items-center justify-center bg-black/20 border-l border-white/5 relative overflow-hidden p-8 order-1 lg:order-2">
                        <div className="absolute inset-0 bg-lh-purple/15 blur-[100px] rounded-full scale-110 animate-pulse"></div>
                        <motion.div style={{ x: charX, y: charY }} className="relative z-10 w-full flex justify-center">
                            <motion.img
                                src={ngdPic}
                                alt="Cyber Character"
                                className="w-full max-w-[280px] h-auto grayscale-[0.2] hover:grayscale-0 transition-all duration-700 drop-shadow-[0_0_30px_rgba(188,19,254,0.3)]"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
