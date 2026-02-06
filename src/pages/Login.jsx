import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Mail, AlertTriangle, Loader2, Phone } from 'lucide-react';
import RedGeometricBackground from '../components/RedGeometricBackground';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Helper for Apple Icon
export default function Login() {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState(''); // Combined email or phone
    const [formData, setFormData] = useState({
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!identifier || !formData.password) {
            alert("All fields are required");
            setIsLoading(false);
            return;
        }

        // ✅ BACKEND EXPECTS: identifier + password
        const payload = {
            identifier: identifier.trim(),
            password: formData.password,
        };

        try {
            const res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || 'Invalid credentials');
                return;
            }

            // ✅ SAVE JWT + USER
            login(data.user, data.token);
            navigate('/');

        } catch (error) {
            console.error(error);
            alert('Server error');
        } finally {
            setIsLoading(false);
        }
    };

    const socialLogin = async (provider) => {
        setIsLoading(true);
        try {
            // Warm up the server before redirecting (important for Render free tier)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            await fetch(BASE_URL, { signal: controller.signal, mode: 'no-cors' }).catch(() => { });
            clearTimeout(timeoutId);

            window.location.href = `${BASE_URL}/api/auth/${provider}`;
        } catch (error) {
            window.location.href = `${BASE_URL}/api/auth/${provider}`; // Fallback to direct redirect
        }
    };



    return (
        // Fixed Viewport Wrapper
        <div className="h-screen w-screen relative font-['Inter'] overflow-hidden flex flex-col">

            {/* Background Layer - Preserving the Aggressive Mountain */}
            <RedGeometricBackground
                height={30}
                jaggednessScale={2.5}
                opacity={0.4}
                planeSize={[60, 40]}
                cameraPos={[0, 0, 15]}
                ashCount={200}
                showPoints={false}
                wireframeOpacity={0.2}
            />

            {/* Main Scrollable Area */}
            <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden p-6">

                <div className="min-h-full flex flex-col items-center justify-center py-10">

                    {/* Logo / Header */}
                    <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="inline-flex items-center gap-3 mb-2">
                            <Shield className="w-10 h-10 text-red-600 fill-red-600/20" />
                            <span className="text-3xl font-black text-white tracking-tight uppercase">CSCA <span className="text-red-600">Secure</span></span>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="w-full max-w-xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_80px_-20px_rgba(220,38,38,0.4)] overflow-hidden animate-in zoom-in-95 duration-500">

                        {/* Red Accent Line */}
                        <div className="h-1 w-full bg-gradient-to-r from-red-900 via-red-600 to-red-900"></div>

                        <div className="p-8 md:p-10">

                            {/* Heading */}
                            <h1 className="text-2xl font-black text-white mb-6 uppercase tracking-wider text-center">Log in</h1>

                            {/* Important Alert */}
                            <div className="mb-6 space-y-4">
                                <p className="text-sm text-gray-300 font-medium leading-relaxed text-center">
                                    We are unifying your CSCA accounts under a single login.
                                </p>

                                <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-lg">
                                    <div className="flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            If you recently received an email with a temporary password, it is part of our new site launch. Ensure the sender is Verified.
                                        </p>
                                    </div>
                                </div>
                            </div>


                            {/* Main Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5 animate-in fade-in duration-300">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Email or Mobile Number</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 focus:bg-black transition-all placeholder:text-gray-700 font-bold"
                                            placeholder="Phone number or email"
                                        />
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center pl-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 focus:bg-black transition-all placeholder:text-gray-700 pr-12 font-bold"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="flex justify-end pt-1">
                                        <Link to="/forgot-password" className="text-[10px] font-bold text-red-500 hover:text-white transition-colors uppercase tracking-wider">Reset password</Link>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 hover:shadow-red-600/20 hover:-translate-y-0.5"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log in"}
                                </button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    className="w-full h-12 flex items-center justify-center gap-3 border border-white/10 rounded-lg hover:bg-white/5 hover:border-white/30 transition-all text-white font-bold group"
                                    onClick={() => socialLogin("google")}
                                >
                                    <span className="text-xs uppercase tracking-widest">Continue with</span>
                                    <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="white">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31l3.57 2.77c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-1.9 0-3.53.8-4.64 2.06l3.63 2.82c.59-.14 1.22-.14 1.82-.14z" fill="#EA4335" />
                                    </svg>
                                </button>
                            </div>

                            <div className="pt-6 text-center">
                                <p className="text-sm text-gray-400">
                                    Don't have an account? <Link to="/register" className="text-red-500 font-bold hover:text-white transition-colors pl-1">Create one</Link>
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 flex flex-wrap justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
                        <Link to="/partners" className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Partners</Link>
                        <Link to="/legal" className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Legal</Link>
                        <Link to="/contact" className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Contact</Link>
                        <Link to="/privacy" className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Privacy</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}