import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Shield, ArrowLeft, ChevronLeft,
    Menu, User, MessageSquare, LogOut, Info, Globe, Languages, ArrowRight
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
            <span className="text-[9px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Syncing Language Protocols...</span>
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest tracking-widest">Adjusting registry nodes</span>
        </div>
    </div>
);

const SelectExamLanguage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const examName = location.state?.examName || "CSCA Certification Exam";
    const selectedOption = location.state?.selectedOption;

    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const languages = [
        { id: 'en', name: 'English' },
        { id: 'de', name: 'German' },
        { id: 'jp', name: 'Japanese' }
    ];

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
                        back to previous step
                    </button>
                    <div className="px-3 py-1 bg-lh-purple/10 border border-lh-purple/20 rounded-lg text-[8px] font-black text-lh-purple uppercase tracking-widest animate-pulse">
                        UPLINK_STABLE
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Select exam <span className="text-lh-purple text-transparent" style={{ WebkitTextStroke: '1px #bc13fe' }}>language</span></h2>
                </div>

                <PrecisionPanel className="p-8 border-white/5 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center gap-5 border-b border-white/5 pb-8 mb-8">
                        <div className="p-3 bg-lh-purple/10 rounded-xl">
                            <Shield size={20} className="text-lh-purple" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-lh-purple uppercase tracking-widest mb-1">Registry_Active_Node:</p>
                            <h4 className="text-xl font-black uppercase tracking-tight text-white">{examName}</h4>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300">Preferred operational language?</h5>
                            <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest border-l border-white/10 pl-4 opacity-70">
                                Language chosen here is for exam content delivery.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 max-w-sm">
                            {languages.map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => setSelectedLanguage(lang.id)}
                                    className={`flex items-center justify-between p-5 rounded-xl border transition-all duration-300 group ${selectedLanguage === lang.id
                                        ? 'bg-lh-purple border-lh-purple shadow-[0_10px_25px_rgba(188,19,254,0.3)]'
                                        : 'bg-white/5 border-white/5 hover:border-lh-purple/30'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-lg transition-colors ${selectedLanguage === lang.id ? 'bg-white/20' : 'bg-lh-purple/10 group-hover:bg-lh-purple/20'}`}>
                                            <Globe size={18} className={`${selectedLanguage === lang.id ? 'text-white' : 'text-lh-purple'}`} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${selectedLanguage === lang.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                            {lang.name}
                                        </span>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selectedLanguage === lang.id
                                        ? 'border-white bg-white shadow-[0_0_10px_white]'
                                        : 'border-white/10'
                                        }`}>
                                        {selectedLanguage === lang.id && <div className="w-2 h-2 rounded-full bg-lh-purple"></div>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-8 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/10 transition-all font-mono"
                        >
                            PREVIOUS
                        </button>
                        <button
                            disabled={!selectedLanguage}
                            onClick={() => navigate('/dashboard/provide-additional-info', { state: { examName, selectedLanguage, selectedOption } })}
                            className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-mono flex items-center gap-3 active:scale-95 ${selectedLanguage
                                ? 'bg-lh-purple text-white shadow-[0_10px_30px_rgba(188,19,254,0.3)] hover:scale-105'
                                : 'bg-white/[0.02] text-gray-800 cursor-not-allowed border border-white/5'
                                }`}
                        >
                            NEXT_REGISTRY_SYNC
                            <ArrowRight size={14} className={selectedLanguage ? 'animate-bounce-x' : ''} />
                        </button>
                    </div>
                </PrecisionPanel>
            </div>
        </div>
    );
};

export default SelectExamLanguage;
