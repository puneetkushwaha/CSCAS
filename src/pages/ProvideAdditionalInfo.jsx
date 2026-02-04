import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Shield, ChevronLeft, Menu, User, MessageSquare, LogOut, Info, ArrowRight
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
            <span className="text-[9px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Verifying Registry Data...</span>
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest italic tracking-widest">Syncing candidate protocols</span>
        </div>
    </div>
);

const ProvideAdditionalInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const examName = location.state?.examName || "CSCA Certification Exam";
    const selectedLanguage = location.state?.selectedLanguage;
    const selectedOption = location.state?.selectedOption;

    const [temporaryCountry, setTemporaryCountry] = useState(null);
    const [hasAuthorization, setHasAuthorization] = useState(null);
    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsPageLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleTemporaryCountryChange = (value) => {
        setTemporaryCountry(value);
        if (value === 'no') {
            setHasAuthorization(null);
        }
    };

    if (isPageLoading) return <GlobalPageLoader />;

    return (
        <div className="min-h-full flex flex-col relative pb-12">
            <div className="max-w-[1000px] mx-auto w-full pt-4 space-y-8">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-widest group transition-colors italic"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        back to previous step
                    </button>
                    <div className="px-3 py-1 bg-lh-purple/10 border border-lh-purple/20 rounded-lg text-[8px] font-black text-lh-purple uppercase tracking-widest italic animate-pulse">
                        UPLINK_STABLE
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Provide additional <span className="text-lh-purple text-transparent" style={{ WebkitTextStroke: '1px #bc13fe' }}>information</span></h2>
                </div>

                <PrecisionPanel className="p-8 border-white/5 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center gap-5 border-b border-white/5 pb-8 mb-8">
                        <div className="p-3 bg-lh-purple/10 rounded-xl">
                            <Shield size={20} className="text-lh-purple" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-lh-purple uppercase tracking-widest mb-1 italic">Registry_Active_Node:</p>
                            <h4 className="text-xl font-black uppercase tracking-tight text-white italic">{examName}</h4>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl border-l-2 border-l-lh-purple/50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                Required fields are marked with <span className="text-lh-purple animate-pulse">*</span>. Enter information using Alphanumeric characters only.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-5">
                                <label className="text-[11px] font-black uppercase tracking-widest text-white flex items-start gap-2 leading-relaxed max-w-2xl italic">
                                    <span className="text-lh-purple">*</span>
                                    <span>Are you temporarily in another country and plan to take a CSCA exam outside the country of your current residence or citizenship?</span>
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-sm ml-6">
                                    {['yes', 'no'].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleTemporaryCountryChange(opt)}
                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${temporaryCountry === opt
                                                ? 'bg-lh-purple border-lh-purple shadow-[0_10px_25px_rgba(188,19,254,0.3)]'
                                                : 'bg-white/5 border-white/5 hover:border-lh-purple/30'
                                                }`}
                                        >
                                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${temporaryCountry === opt ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                                {opt === 'yes' ? 'Yes, Affirmative' : 'No, Negative'}
                                            </span>
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${temporaryCountry === opt
                                                ? 'border-white bg-white shadow-[0_0_10px_white]'
                                                : 'border-white/10'
                                                }`}>
                                                {temporaryCountry === opt && <div className="w-2 h-2 rounded-full bg-lh-purple"></div>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Conditional Authorization Question */}
                            {temporaryCountry === 'yes' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-5 ml-6 pl-6 border-l border-lh-purple/20"
                                >
                                    <div className="p-3 bg-lh-purple/5 border border-lh-purple/10 rounded-xl w-fit">
                                        <p className="text-[8px] text-lh-purple font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                            <Info size={12} /> Response_Required
                                        </p>
                                    </div>
                                    <label className="text-[11px] font-black uppercase tracking-widest text-white flex items-start gap-2 italic">
                                        <span className="text-lh-purple">*</span>
                                        <span>Have you received authorization from CSCA to test out of country?</span>
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-sm">
                                        {['yes', 'no'].map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => setHasAuthorization(opt)}
                                                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${hasAuthorization === opt
                                                    ? 'bg-lh-purple border-lh-purple shadow-[0_10px_25px_rgba(188,19,254,0.3)]'
                                                    : 'bg-white/5 border-white/5 hover:border-lh-purple/30'
                                                    }`}
                                            >
                                                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${hasAuthorization === opt ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                                    {opt === 'yes' ? 'YES' : 'NO'}
                                                </span>
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${hasAuthorization === opt
                                                    ? 'border-white bg-white shadow-[0_0_10px_white]'
                                                    : 'border-white/10'
                                                    }`}>
                                                    {hasAuthorization === opt && <div className="w-2 h-2 rounded-full bg-lh-purple"></div>}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
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
                            disabled={!temporaryCountry || (temporaryCountry === 'yes' && !hasAuthorization)}
                            onClick={() => navigate('/dashboard/testing-policies', { state: { examName, temporaryCountry, hasAuthorization, selectedLanguage, selectedOption } })}
                            className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-mono flex items-center gap-3 active:scale-95 ${(temporaryCountry && (temporaryCountry === 'no' || hasAuthorization))
                                ? 'bg-lh-purple text-white shadow-[0_10px_30px_rgba(188,19,254,0.3)] hover:scale-105'
                                : 'bg-white/[0.02] text-gray-800 cursor-not-allowed border border-white/5'
                                }`}
                        >
                            NEXT_REGISTRY_SYNC
                            <ArrowRight size={14} className={(temporaryCountry && (temporaryCountry === 'no' || hasAuthorization)) ? 'animate-bounce-x' : ''} />
                        </button>
                    </div>
                </PrecisionPanel>
            </div>
        </div>
    );
};

export default ProvideAdditionalInfo;
