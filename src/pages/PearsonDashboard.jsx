import React from 'react';
import {
    Shield,
    ChevronRight,
    ArrowRight,
    User,
    Calendar,
    FileText,
    Settings,
    CreditCard,
    History,
    Info,
    Menu,
    MessageSquare,
    LogOut,
    Globe,
    ExternalLink,
    ChevronDown,
    ShoppingCart,
    HelpCircle,
    X,
    ChevronLeft,
    Activity,
    LayoutDashboard,
    Globe2,
    Monitor
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ngdPic from '../assets/images/ngd-pic.png';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/70 backdrop-blur-3xl border border-white/5 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
        {/* Layered background glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-lh-purple/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        {/* Professional top highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/40 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const PearsonDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 pb-16 relative">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lh-purple/5 blur-[180px] rounded-full pointer-events-none"></div>

            <header className="mb-12 relative z-10 flex items-center gap-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-lh-purple/10 rounded-[2rem] border border-lh-purple/20 p-2 relative group"
                >
                    <div className="absolute inset-0 bg-lh-purple/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src={ngdPic} alt="Mascot" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(188,19,254,0.3)] animate-float" />
                </motion.div>

                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 bg-lh-purple rounded-full shadow-[0_0_15px_rgba(188,19,254,0.6)] animate-pulse"></div>
                        <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.5em] italic opacity-80">Operational_Interface_Active</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                        EXAM <span className="text-transparent font-black" style={{ WebkitTextStroke: '1px #bc13fe' }}>CENTRAL</span>
                    </h1>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10">
                {/* CENTER COLUMN */}
                <div className="flex-1 space-y-12">
                    {/* Exam Control Module */}
                    <PrecisionPanel className="p-12 border-lh-purple/10 shadow-[0_40px_120px_rgba(0,0,0,0.7)] relative overflow-hidden">
                        {/* Decorative Large Watermark Mascot */}
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
                            <img src={ngdPic} alt="" className="w-full h-full object-contain -rotate-12" />
                        </div>

                        <div className="flex items-center gap-5 mb-10 pb-6 border-b border-white/5 relative z-10">
                            <div className="w-12 h-12 bg-lh-purple rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(188,19,254,0.4)]">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">Registration_Sequence</h3>
                                <p className="text-[11px] font-black text-lh-purple uppercase tracking-[0.2em] italic mt-2 opacity-80 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                                    Status: Sync_Verified
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                            <div className="space-y-8">
                                <p className="text-[14px] text-gray-400 font-bold leading-relaxed tracking-wide italic border-l-4 border-lh-purple/40 pl-6 bg-white/[0.01] py-4 rounded-r-2xl">
                                    Initialize the certification protocol to discover available examination parameters and secure testing slots within our global network.
                                </p>
                                <button
                                    onClick={() => navigate('/dashboard/find-exam')}
                                    className="group relative px-12 py-5 bg-lh-purple overflow-hidden rounded-[1.5rem] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(188,19,254,0.4)] flex items-center gap-4"
                                >
                                    <span className="relative z-10 text-[12px] font-black text-white uppercase tracking-[0.5em]">Find Exams Now</span>
                                    <ArrowRight size={18} className="relative z-10 text-white group-hover:translate-x-3 transition-transform" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                </button>
                            </div>

                            <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] flex flex-col justify-center relative group/inner">
                                <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover/inner:opacity-100 transition-opacity rounded-[2.5rem]"></div>
                                <div className="flex items-center justify-between mb-5 group cursor-pointer relative z-10">
                                    <p className="text-[11px] font-black text-lh-purple uppercase tracking-[0.2em] italic flex items-center gap-3">
                                        <div className="w-1.5 h-[10px] bg-lh-purple"></div>
                                        Have a Voucher Code?
                                    </p>
                                    <ChevronDown size={16} className="text-gray-500 group-hover:text-lh-purple transition-colors" />
                                </div>
                                <div className="h-px bg-white/10 my-4 relative z-10"></div>
                                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em] italic leading-relaxed relative z-10 opacity-70">
                                    Specialized access keys grant entry to restricted professional tiers. Enter your code to bypass standard protocols.
                                </p>
                            </div>
                        </div>
                    </PrecisionPanel>

                    {/* Event Logs Tracker */}
                    <PrecisionPanel className="p-10 border-white/5 relative overflow-hidden group/logs">
                        <div className="flex items-center gap-5 mb-10 relative z-10">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover/logs:border-lh-purple/30 transition-colors">
                                <Calendar className="w-6 h-6 text-lh-purple drop-shadow-[0_0_15px_rgba(188,19,254,0.5)]" />
                            </div>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">Operational_Logs</h3>
                        </div>

                        <div className="relative p-12 border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center bg-black/50 group-hover/logs:border-lh-purple/40 transition-all duration-1000 overflow-hidden">
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover/logs:opacity-100 transition-opacity blur-3xl"></div>

                            <div className="relative z-10 p-8 bg-white/10 rounded-full mb-8 scale-110 group-hover/logs:scale-125 transition-transform duration-700">
                                <History className="w-12 h-12 text-gray-700 opacity-40 group-hover/logs:text-lh-purple/50 transition-colors" />
                                <div className="absolute inset-0 bg-lh-purple/20 rounded-full blur-[40px] opacity-0 group-hover/logs:opacity-100 transition-opacity animate-pulse"></div>
                            </div>

                            <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 relative z-10">NO_PENDING_OBJECTIVES</h4>
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] leading-relaxed max-w-sm italic opacity-70 relative z-10">
                                Your mission queue is currently empty. Synchronize with a certification node to populate your active history.
                            </p>
                        </div>
                    </PrecisionPanel>
                </div>

                {/* RIGHT COLUMN: Intel */}
                <aside className="w-80 space-y-10 flex-shrink-0 relative z-10">
                    <PrecisionPanel className="p-12 relative group/aside">
                        {/* Aside Mascot Accent */}
                        <div className="absolute top-0 left-0 -ml-10 -mt-10 w-32 h-32 opacity-[0.04] pointer-events-none group-hover/aside:opacity-10 transition-opacity">
                            <img src={ngdPic} alt="" className="w-full h-full object-contain -scale-x-100" />
                        </div>

                        <h3 className="text-[12px] font-black text-lh-purple uppercase tracking-[0.5em] mb-12 pb-6 border-b border-white/10 italic flex items-center justify-between relative z-10">
                            My Account intel
                            <Activity size={16} className="animate-pulse" />
                        </h3>
                        <ul className="space-y-4 relative z-10">
                            {[
                                { label: 'Additional information', path: '/dashboard/additional-info' },
                                { label: 'Registry Preferences', path: '/dashboard/registry-preferences' },
                                { label: 'Exam Mission History', path: '/dashboard/exam-history' },
                                { label: 'View score reports', path: '/dashboard/score-reports' },
                                { label: 'Protocol Receipts', path: '/dashboard/payment-receipts' }
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-lh-purple/10 border border-transparent hover:border-lh-purple/20 transition-all group/item text-left shadow-lg hover:shadow-lh-purple/5"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-2 h-2 bg-lh-purple/40 rounded-full group-hover/item:scale-150 group-hover/item:bg-lh-purple transition-all"></div>
                                            <span className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover/item:text-white transition-colors">{item.label}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-lh-purple opacity-30 group-hover/item:translate-x-3 group-hover/item:opacity-100 transition-all" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </PrecisionPanel>

                    {/* Marketplace AD */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="relative rounded-[3rem] overflow-hidden group/ad h-[420px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-lh-purple via-lh-dark to-black"></div>
                        <div className="absolute inset-0 bg-lh-purple/10 pointer-events-none"></div>

                        {/* Animated Orbs */}
                        <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-[60px]"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-lh-purple/20 rounded-full blur-[50px]"></div>

                        <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                    <Monitor size={14} className="text-lh-purple" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white italic">MARKET_RELAY</span>
                                </div>
                                <h4 className="text-5xl font-black italic uppercase tracking-tighter leading-[0.9] text-white">Operational <br /><span className="text-lh-purple">Market</span></h4>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed italic opacity-80">
                                    Access certified physical hardware and intellectual nodes required for operational success.
                                </p>
                            </div>

                            <button className="w-full py-6 bg-white text-lh-dark font-black text-[12px] uppercase tracking-[0.4em] rounded-2xl hover:bg-lh-purple hover:text-white transition-all transform hover:shadow-[0_20px_40px_rgba(188,19,254,0.4)] active:scale-95 shadow-2xl">
                                VIEW_MARKET
                            </button>
                        </div>
                    </motion.div>
                </aside>
            </div>
        </div>
    );
};

export default PearsonDashboard;
