import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import ngdPic from '../assets/images/ngd-pic.png';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

import api from '../utils/api';

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
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
    });

    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX - window.innerWidth / 2);
            mouseY.set(e.clientY - window.innerHeight / 2);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Handle redirect result for mobile Google signup
    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result && result.user) {
                    const user = result.user;

                    // Send to backend
                    const res = await api.post('/auth/google-login', {
                        email: user.email,
                        name: user.displayName,
                        avatar: user.photoURL,
                        uid: user.uid
                    });

                    login(res.data.user, res.data.token);
                    alert("Success! Now redirecting to NEW DASHBOARD...");
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error("Redirect Result Error:", error);
                if (error.code !== 'auth/popup-closed-by-user') {
                    const message = error.response?.data?.message || error.message || 'Login failed';
                    alert(message);
                }
            }
        };

        handleRedirectResult();
    }, [login, navigate]);

    const handleCardClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setRipples(prev => [...prev, { x, y, id }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1000);
    };

    const socialLogin = async (provider) => {
        if (provider === 'google') {
            setIsLoading(true);

            // Detect mobile device
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

            try {
                if (isMobile) {
                    // Use redirect for mobile devices (better compatibility)
                    await signInWithRedirect(auth, googleProvider);
                    // Note: The page will redirect, so loader will stay visible
                } else {
                    // Use popup for desktop (better UX)
                    const result = await signInWithPopup(auth, googleProvider);
                    const user = result.user;

                    // Send to backend
                    const res = await api.post('/auth/google-login', {
                        email: user.email,
                        name: user.displayName,
                        avatar: user.photoURL,
                        uid: user.uid
                    });

                    login(res.data.user, res.data.token);
                    alert("Success! Now redirecting to NEW DASHBOARD...");
                    navigate('/dashboard');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Google Login Error:", error);
                // Don't show error if user closed popup intentionally
                if (error.code !== 'auth/popup-closed-by-user') {
                    const message = error.response?.data?.message || error.message || 'Google Login Failed';
                    alert(message);
                }
                setIsLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
            alert("All fields are required");
            return;
        }

        setIsLoading(true);

        const payload = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
        };

        try {
            const res = await api.post('/auth/register', payload);

            alert("Registration Successful!");
            navigate('/login');
        } catch (error) {
            console.error("Signup error:", error);
            const message = error.response?.data?.message || "Registration failed";
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
                                    Create <span className="text-lh-purple">Account</span>
                                </h1>
                                <p className="text-gray-400 font-bold text-[10px] tracking-wide border-l-2 border-lh-purple pl-4 uppercase">
                                    Fill in the details to join our network.
                                </p>
                            </motion.div>

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
                                        type="email"
                                        required
                                        placeholder="EMAIL ADDRESS"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants} className="relative group/input">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="PHONE NUMBER"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700"
                                    />
                                </motion.div>

                                <div className="grid md:grid-cols-1 gap-4">
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
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.769 -21.864 51.959 -21.864 51.129 C -21.864 50.299 -21.734 49.489 -21.484 48.729 L -21.484 45.639 L -25.464 45.639 C -26.274 47.249 -26.734 49.069 -26.734 51.129 C -26.734 53.189 -26.274 55.009 -25.464 56.619 L -21.484 53.529 Z" />
                                            <path fill="#EA4335" d="M -14.754 43.749 C -12.984 43.749 -11.404 44.359 -10.154 45.549 L -6.744 42.139 C -8.804 40.219 -11.514 39.009 -14.754 39.009 C -19.444 39.009 -23.494 41.709 -25.464 45.639 L -21.484 48.729 C -20.534 45.879 -17.884 43.749 -14.754 43.749 Z" />
                                        </g>
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none pt-1">Continue with Google</span>
                                </motion.button>
                            </div>

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