import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Shield, ArrowLeft, Monitor, ChevronLeft,
    Menu, User, MessageSquare, LogOut, Info, Clock,
    Laptop, Home, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[1.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden group transition-all duration-700 ${className}`}>
        {/* Subtle hover glow */}
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        {/* Top intensity line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const GlobalPageLoader = () => (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-lh-dark">
        <div className="relative mb-6">
            <div className="absolute inset-0 bg-lh-purple blur-2xl opacity-20 animate-pulse"></div>
            <div className="w-12 h-12 border-t-2 border-r-2 border-lh-purple rounded-full animate-spin"></div>
            <Shield size={20} className="absolute inset-0 m-auto text-lh-purple" />
        </div>
        <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Configuring Session...</span>
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest tracking-widest">Bridging secure connection</span>
        </div>
    </div>
);

const SelectExamOptions = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const examName = location.state?.examName || "CSCA Certification Exam";
    const [selectedOption, setSelectedOption] = useState(null);
    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsPageLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isPageLoading) return <GlobalPageLoader />;

    return (
        <div className="min-h-full flex flex-col relative pb-12">
            <div className="max-w-[1000px] mx-auto w-full pt-4 space-y-8">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-widest group transition-colors"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        back to catalog
                    </button>
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-[8px] font-black text-green-500 uppercase tracking-widest animate-pulse">
                        UPLINK_STABLE
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Select exam <span className="text-lh-purple text-transparent" style={{ WebkitTextStroke: '1px #bc13fe' }}>options</span></h2>
                </div>

                <PrecisionPanel className="p-8 border-white/5 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center gap-5 border-b border-white/5 pb-8 mb-8">
                        <div className="p-3 bg-lh-purple/10 rounded-xl">
                            <Shield size={20} className="text-lh-purple" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-lh-purple uppercase tracking-widest mb-1">Active_Registration_Slot:</p>
                            <h4 className="text-xl font-black uppercase tracking-tight text-white">{examName}</h4>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300">How do you want to take your exam?</h5>
                            <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest border-l border-white/10 pl-4 opacity-70">
                                Select an operational mode for this session.
                            </p>
                        </div>

                        <div className="max-w-md">
                            <button
                                onClick={() => setSelectedOption('online')}
                                className={`p-6 w-full rounded-2xl border transition-all duration-500 flex items-center justify-between group/opt ${selectedOption === 'online'
                                    ? 'bg-lh-purple text-white border-lh-purple shadow-[0_10px_30px_rgba(188,19,254,0.3)] scale-[1.02]'
                                    : 'bg-white/5 border-white/5 hover:border-lh-purple/30 hover:bg-lh-purple/5'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl transition-colors ${selectedOption === 'online' ? 'bg-white/20' : 'bg-lh-purple/10 group-hover/opt:bg-lh-purple/20'}`}>
                                        <Monitor size={24} className={`${selectedOption === 'online' ? 'text-white' : 'text-lh-purple'}`} />
                                    </div>
                                    <div className="text-left">
                                        <span className={`text-[11px] font-black uppercase tracking-widest block ${selectedOption === 'online' ? 'text-white' : 'text-gray-400 group-hover/opt:text-white'}`}>Online with OnVUE</span>
                                        <span className={`text-[8px] font-bold uppercase tracking-widest opacity-60 ${selectedOption === 'online' ? 'text-white' : 'text-gray-600'}`}>Secure Remote Proctoring</span>
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full transition-all ${selectedOption === 'online' ? 'bg-white animate-pulse shadow-[0_0_10px_white]' : 'bg-white/10'}`}></div>
                            </button>
                        </div>

                        {selectedOption === 'online' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-10"
                            >
                                <h6 className="text-[12px] font-black uppercase tracking-widest text-white mb-6 pb-4 border-b border-white/5">
                                    Prepare to take your exam with <span className="text-lh-purple">OnVUE</span>
                                </h6>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { icon: Laptop, title: 'Compute Node', detail: 'Personal computer with webcam/uplink.' },
                                        { icon: Home, title: 'Secure Sector', detail: 'Distraction-free private space.' },
                                        { icon: ShieldCheck, title: 'Identity Data', detail: 'Government-issued ID verification.' },
                                        { icon: Clock, title: 'Pre-check', detail: 'Authenticate 30m before launch.' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center text-center space-y-4 group/info">
                                            <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center p-2 group-hover/info:border-lh-purple/30 transition-all shadow-inner relative overflow-hidden">
                                                <div className="absolute inset-0 bg-lh-purple opacity-0 group-hover:opacity-5 transition-opacity"></div>
                                                <item.icon size={20} className="text-lh-purple" />
                                            </div>
                                            <div className="space-y-2">
                                                <h6 className="text-[9px] font-black uppercase tracking-widest text-white">{item.title}</h6>
                                                <p className="text-[8px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest opacity-70">
                                                    {item.detail}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 flex gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-8 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/10 transition-all font-mono"
                        >
                            PREVIOUS
                        </button>
                        <button
                            disabled={!selectedOption}
                            onClick={() => navigate('/dashboard/select-exam-language', { state: { examName, selectedOption } })}
                            className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-mono flex items-center gap-3 active:scale-95 ${selectedOption
                                ? 'bg-lh-purple text-white shadow-[0_10px_30px_rgba(188,19,254,0.3)] hover:scale-105'
                                : 'bg-white/[0.02] text-gray-800 cursor-not-allowed border border-white/5'
                                }`}
                        >
                            NEXT_STEP
                            <ArrowRight size={14} className={selectedOption ? 'animate-bounce-x' : ''} />
                        </button>
                    </div>
                </PrecisionPanel>
            </div>
        </div>
    );
};

export default SelectExamOptions;
