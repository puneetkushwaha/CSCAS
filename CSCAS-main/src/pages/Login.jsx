import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Shield, Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';
import ngdPic from '../assets/images/ngd-pic.png';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

import api from '../utils/api';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

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
    const [isNavigating, setIsNavigating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

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
        setIsLoading(true);
        if (!identifier || !password) {
            console.error("All fields are required");
            setIsLoading(false);
            return;
        }


        // Try with identifier field (some backends expect this)
        let payload = {
            identifier: identifier.trim(),
            password: password,
        };

        console.log("📤 Sending login payload:", payload);

        try {
            const res = await api.post('/auth/login', payload);

            console.log("📧 Full Response:", res);
            console.log("📧 Response Data:", res.data);
            console.log("📧 Response Data Keys:", Object.keys(res.data));



            console.log("📧 User data:", res.data.user);
            console.log("📧 Token:", res.data.token);

            // Check if data is nested or has different structure
            const userData = res.data.user || res.data.data?.user;
            const token = res.data.token || res.data.data?.token || res.data.accessToken || res.data.authToken;

            console.log("✅ Extracted User:", userData);
            console.log("✅ Extracted Token:", token);

            if (userData && token) {
                login(userData, token);
                // Delay navigation to show animation
                setIsNavigating(true);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                console.error("❌ Login failed - no user or token in response");
            }
        } catch (error) {
            console.error("Login error:", error);

            // If identifier fails with 401, try with email field
            if (error.response?.status === 401 && payload.identifier) {
                console.log("🔄 Retrying with 'email' field instead of 'identifier'");
                try {
                    const emailPayload = {
                        email: identifier.trim(),
                        password: password,
                    };
                    const res = await api.post('/auth/login', emailPayload);

                    console.log("📧 Manual Login Response (email field):", res.data);
                    login(res.data.user, res.data.token);

                    setIsNavigating(true);
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                    setIsLoading(false);
                    return;
                } catch (retryError) {
                    console.error("Retry with email also failed:", retryError);
                }
            }

            const message = error.response?.data?.message || 'Invalid credentials';
            console.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const socialLogin = async (provider) => {
        if (provider === 'google') {
            setIsLoading(true);
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;

                // Send to backend
                const nameParts = user.displayName ? user.displayName.split(' ') : ['User'];
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ') || '';

                const res = await api.post('/auth/google-login', {
                    email: user.email,
                    firstName: firstName,
                    lastName: lastName,
                    avatar: user.photoURL,
                    uid: user.uid
                });

                console.log("🔵 Google Login Response:", res.data);
                console.log("🔵 User data:", res.data.user);
                console.log("🔵 Token:", res.data.token);

                login(res.data.user, res.data.token);

                // Delay navigation to ensure auth state is saved
                setIsNavigating(true);
                setTimeout(() => {
                    navigate('/');
                }, 2000);

            } catch (error) {
                console.error("Google Login Error:", error);
                const message = error.response?.data?.message || error.message || 'Google Login Failed';
                console.error("Google login failed:", message);
            } finally {
                setIsLoading(false);
            }
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
            <AnimatePresence>
                {isNavigating && <Loader text="ACCESS GRANTED" />}
            </AnimatePresence>
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
                                <Link to="/" className="inline-flex items-center gap-2 text-lh-purple text-[10px] font-black uppercase tracking-widest hover:text-white transition-all group/back">
                                    <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" /> Back to Home
                                </Link>
                                <div className="flex items-center gap-3">
                                    <Shield className="text-lh-purple" size={32} />
                                    <h1 className="text-3xl md:text-5xl font-[900] uppercase tracking-tighter">
                                        User <span className="text-lh-purple">Login</span>
                                    </h1>
                                </div>
                                <p className="text-gray-400 font-bold text-xs tracking-wide border-l-2 border-lh-purple pl-4 uppercase">
                                    Enter your details to access your account.
                                </p>
                            </motion.div>

                            <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-lg">
                                <div className="flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-gray-400 leading-relaxed font-bold uppercase tracking-wider">
                                        If you recently received an email with a temporary password, it is part of our new site launch. Ensure the sender is Verified.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
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
                                    <motion.div variants={itemVariants} className="relative group/input">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="PASSWORD"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 pl-14 pr-12 text-[11px] font-black tracking-[0.2em] outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.03] transition-all placeholder:text-gray-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </motion.div>
                                </div>

                                <motion.div variants={itemVariants} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <label className="flex items-center gap-2 cursor-pointer group/check text-gray-400 hover:text-white transition-colors">
                                        <input type="checkbox" className="hidden peer" />
                                        <div className="w-5 h-5 border-2 border-white/10 rounded-md flex items-center justify-center peer-checked:bg-lh-purple peer-checked:border-lh-purple transition-all group-hover/check:border-lh-purple/40">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                        </div>
                                        <span>Maintain Session</span>
                                    </label>
                                    <Link to="/forgot-password" title="Recover Key" className="text-lh-purple hover:text-white hover:underline transition-all">FORGOT PASSWORD</Link>
                                </motion.div>

                                <motion.button
                                    variants={itemVariants}
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(188, 19, 254, 0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-lh-purple text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all relative overflow-hidden group/btn flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="relative z-10">Sign In</span>}
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                                </motion.button>
                            </form>

                            <motion.div variants={itemVariants} className="relative flex items-center gap-4">
                                <div className="flex-1 h-[1px] bg-white/5"></div>
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Or continue with</span>
                                <div className="flex-1 h-[1px] bg-white/5"></div>
                            </motion.div>

                            <div className="space-y-4 text-center">
                                <motion.button
                                    variants={itemVariants}
                                    onClick={() => socialLogin("google")}
                                    className="w-full flex items-center justify-center gap-3 bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 py-4 rounded-xl transition-all group/social"
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

                            <motion.p variants={itemVariants} className="text-center text-[11px] font-bold text-gray-500 uppercase tracking-widest pt-2">
                                Don't have an account? <Link to="/signup" className="text-lh-purple hover:text-white transition-colors underline underline-offset-4">Sign Up</Link>
                            </motion.p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>


        </div>
    );
};

export default Login;