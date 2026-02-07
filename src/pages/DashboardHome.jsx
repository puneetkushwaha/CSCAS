import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, ChevronRight, HelpCircle, ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ngdPic from '../assets/images/ngd-pic.png';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
        {/* Subtle hover glow */}
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        {/* Top intensity line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const DashboardHome = () => {
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }) + '_UTC';
    };

    return (
        <div className="space-y-12 pb-16 relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-lh-purple/10 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[20%] left-[-5%] w-[300px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Header / Welcome Row */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Mascot Avatar for Welcome */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-20 h-20 shrink-0"
                    >
                        <div className="absolute inset-0 bg-lh-purple/20 blur-xl rounded-full"></div>
                        <img src={ngdPic} alt="Mascot" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(188,19,254,0.4)]" />
                    </motion.div>

                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4"
                        >
                            Welcome, <span className="text-lh-purple italic">{user?.firstName}</span>
                        </motion.h1>
                        <div className="flex items-center gap-4 text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
                            <span className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                                Connection_Stable
                            </span>
                            <span className="h-4 w-px bg-white/10"></span>
                            <span className="flex items-center gap-2">
                                <Shield className="w-3 h-3 text-lh-purple" />
                                Clear_Access_Tier
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right hidden md:block ml-auto">
                    <p className="text-[8px] font-black text-lh-purple uppercase tracking-widest mb-1 italic">Current System Time:</p>
                    <p className="text-xl font-black italic text-white uppercase tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        {formatTime(currentTime)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                {/* Main Training HUD */}
                <div className="lg:col-span-8 space-y-8">
                    <PrecisionPanel className="p-10 border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
                        {/* Decorative Background Mascot Overlay */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-700">
                            <img src={ngdPic} alt="" className="w-full h-full object-contain rotate-12" />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8 relative z-10">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-white tracking-tight uppercase italic leading-none">
                                    Certification<span className="text-lh-purple">Hub</span>
                                </h2>
                                <p className="text-gray-400 font-bold text-sm leading-relaxed max-w-xl opacity-80">
                                    Explore the full directory of professional technical standards. Each module is engineered for maximum operational efficiency and skill validation.
                                </p>
                            </div>
                            <button className="group relative px-8 py-4 bg-lh-purple overflow-hidden rounded-xl transition-all hover:scale-110 active:scale-95 shadow-[0_0_40px_rgba(188,19,254,0.3)] animate-pulse">
                                <span className="relative z-10 text-[11px] font-black text-white uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] animate-[glow_2s_ease-in-out_infinite]">Active Registry</span>
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-20"></div>
                            </button>
                        </div>

                        {/* Interactive Hero Area */}
                        <div className="relative min-h-[350px] md:min-h-[400px] bg-[#050505] rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center group/hero overflow-hidden shadow-2xl py-8">
                            <div className="absolute inset-0 bg-gradient-to-b from-lh-purple/5 to-transparent pointer-events-none group-hover/hero:from-lh-purple/10 transition-colors duration-700"></div>

                            {/* Floating Mascot in Hero */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10 flex flex-col items-center gap-6"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-lh-purple/30 blur-[40px] rounded-full scale-110 animate-pulse"></div>
                                    <img
                                        src={ngdPic}
                                        alt="Mascot"
                                        className="relative z-10 w-32 md:w-52 drop-shadow-[0_0_30px_rgba(188,19,254,0.5)] group-hover/hero:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                <Link to="/dashboard/certifications" className="relative group/btn mt-1">
                                    <div className="absolute -inset-4 bg-lh-purple/20 blur-2xl opacity-0 group-hover/btn:opacity-100 transition-all duration-500"></div>
                                    <button className="px-10 py-3.5 bg-white text-lh-dark text-[10px] font-black uppercase tracking-[0.4em] rounded-xl hover:bg-lh-purple hover:text-white transition-all transform shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(188,19,254,0.4)] active:scale-95 relative z-10 border border-white/10">
                                        Open Catalog
                                    </button>
                                </Link>
                            </motion.div>

                            {/* Corner Accents */}
                            <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/10 group-hover/hero:border-lh-purple transition-all duration-700"></div>
                            <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/10 group-hover/hero:border-lh-purple transition-all duration-700"></div>
                        </div>

                        <div className="mt-10 p-8 bg-white/[0.02] rounded-3xl border border-white/5 space-y-4">
                            <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <Info className="w-5 h-5 text-lh-purple" />
                                Operational Information Node
                            </div>
                            <p className="text-[12px] text-gray-500 font-bold leading-relaxed tracking-wide italic opacity-80">
                                Registration keys are generated post-order approval. For bulk enrollments or enterprise deployment, please contact the <button className="text-lh-purple hover:text-white transition-colors underline decoration-lh-purple/30 underline-offset-4">Command Center</button>.
                            </p>
                        </div>
                    </PrecisionPanel>
                </div>

                {/* Sidebar Support / Exams */}
                <div className="lg:col-span-4 space-y-8">
                    <PrecisionPanel className="border-white/5 overflow-visible relative group/card">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/card:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
                            <img src={ngdPic} alt="" className="w-24 h-24 object-contain -rotate-12" />
                        </div>

                        <div className="p-10">
                            <div className="text-[10px] font-black text-lh-purple uppercase tracking-[0.4em] mb-10 pb-5 border-b border-white/5 flex items-center justify-between">
                                <span>Management_Relay</span>
                                <div className="w-2 h-2 bg-lh-purple rounded-full animate-ping shadow-[0_0_10px_rgba(188,19,254,0.6)]"></div>
                            </div>

                            <h3 className="text-5xl font-black text-white tracking-tighter mb-5 uppercase italic">Exam_Control</h3>
                            <p className="text-[11px] text-gray-300/80 font-bold mb-10 leading-relaxed uppercase tracking-widest italic opacity-90">
                                Secure exam scheduling and testing node management.
                            </p>

                            <nav className="space-y-4">
                                {[
                                    { label: 'Schedule and Manage Exams', path: '/dashboard/pearson' },
                                    { label: 'View Testing Options', path: '/dashboard/certifications' },
                                    { label: 'Test Accommodations', path: '/dashboard/certifications' }
                                ].map((link, i) => (
                                    <Link key={i} to={link.path} className="group flex items-center justify-between text-[11px] font-black text-lh-purple uppercase tracking-[0.2em] hover:text-white transition-all p-3 rounded-xl hover:bg-lh-purple/5 border border-transparent hover:border-lh-purple/10">
                                        {link.label}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="p-8 bg-white/[0.03] border-t border-white/5 rounded-b-[1.5rem]">
                            <h3 className="text-2xl font-black text-white tracking-tighter mb-3 uppercase italic leading-none">Profile_<span className="text-lh-purple">Vault</span></h3>
                            <p className="text-[10px] text-gray-500 font-bold mb-6 leading-relaxed uppercase tracking-widest italic opacity-60">
                                Access certified metrics, pay CE fees, and verify logos.
                            </p>
                            <Link to="/dashboard/certifications" className="block w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-center text-gray-400 hover:text-lh-purple hover:border-lh-purple/30 transition-all active:scale-95">
                                ACCESS_PORTAL
                            </Link>
                        </div>
                    </PrecisionPanel>

                    {/* HUD Toggle Floating */}
                    <motion.div
                        whileHover={{ scale: 1.02, y: -3 }}
                        className="p-6 bg-lh-purple/10 border border-lh-purple/20 rounded-[1.5rem] flex items-center justify-between group cursor-pointer hover:bg-lh-purple/20 transition-all shadow-xl shadow-lh-purple/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-lh-purple flex items-center justify-center shadow-2xl shadow-lh-purple/40 group-hover:rotate-6 transition-transform duration-500">
                                <HelpCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase text-white mb-1 tracking-widest">Support HUD</h4>
                                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Active_Session_Relay</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-lh-purple group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
