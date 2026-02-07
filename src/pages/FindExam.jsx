import React, { useState, useEffect } from 'react';
import ngdPic from '../assets/images/ngd-pic.png';
import { useNavigate, Link } from 'react-router-dom';
import {
    Shield, Search, Lock, ChevronRight, HelpCircle,
    ArrowLeft, ArrowRight, Loader2, ChevronDown, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/70 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
        {/* Subtle hover glow */}
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        {/* Top intensity line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const GlobalPageLoader = () => (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-lh-dark">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-lh-purple blur-3xl opacity-30 animate-pulse"></div>
            <div className="w-16 h-16 border-t-2 border-r-2 border-lh-purple rounded-full animate-spin"></div>
            <img src={ngdPic} className="absolute inset-0 m-auto w-8 h-8 object-contain" alt="Mascot" />
        </div>
        <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Synchronizing Registry...</span>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Optimizing Operational Catalog</span>
        </div>
    </div>
);

const exams = [
    "CSCA A+ Certification Exams",
    "CSCA Cloud+ Certification Exam",
    "CSCA CloudNetX Certification Exam",
    "CSCA Cybersecurity Analyst (CySA+) Certification Exam",
    "CSCA Data+ Certification Exam",
    "CSCA DataAI Certification Exam",
    "CSCA DataSys+ Certification Exam",
    "CSCA Linux+ Certification Exam",
    "CSCA Network+ Certification Exam",
    "CSCA PenTest+ Certification Exam",
    "CSCA Project+ Certification Exam",
    "CSCA Security+ Certification Exam",
    "CSCA SecurityX Certification Exam",
    "CSCA Server+ Certification Exam",
    "CSCA Tech+ Certification Exam"
];

const FindExam = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [activeGroup, setActiveGroup] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsPageLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const filteredExams = exams.filter(exam =>
        exam.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isPageLoading) return <GlobalPageLoader />;

    return (
        <div className="space-y-6 md:space-y-12 pb-16 relative overflow-x-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-lh-purple/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto w-full pt-4 relative z-10">
                <div className="mb-6 md:mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 md:w-20 md:h-20 bg-lh-purple/10 rounded-3xl border border-lh-purple/20 p-2 flex items-center justify-center relative group"
                    >
                        <div className="absolute inset-0 bg-lh-purple/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img src={ngdPic} alt="Mascot" className="w-full h-full object-contain relative z-10" />
                    </motion.div>

                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="hidden md:block w-10 h-1 bg-lh-purple rounded-full"></div>
                            <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.5em]">Operational_Registry</span>
                        </div>
                        <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Find <span className="text-transparent font-black" style={{ WebkitTextStroke: '1px #bc13fe' }}>an Exam</span></h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                    {/* Search and Voucher Panels */}
                    <div className="lg:col-span-4 space-y-6 md:space-y-8">
                        <PrecisionPanel className="p-5 md:p-10 border-white/5 shadow-2xl">
                            <h3 className="text-[12px] font-black text-lh-purple uppercase tracking-[0.4em] mb-8 flex items-center justify-center md:justify-start gap-3">
                                <Search size={18} /> SEARCH_EXAMS
                            </h3>
                            <div className="relative group/search">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search for an exam..."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-sm font-black text-white focus:outline-none focus:border-lh-purple/50 transition-all placeholder:text-gray-700 uppercase tracking-widest shadow-inner font-mono"
                                />
                                <Search size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within/search:text-lh-purple transition-all" />

                                {/* Results Dropdown */}
                                {searchTerm && (
                                    <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in slide-in-from-top-4 duration-500">
                                        {filteredExams.map((exam, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => navigate('/dashboard/select-exam-options', { state: { examName: exam } })}
                                                className="w-full text-left p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-lh-purple/30 hover:bg-lh-purple/10 transition-all group/item flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-2 h-2 bg-lh-purple rounded-full group-hover/item:scale-150 transition-transform"></div>
                                                    <span className="text-[11px] font-black text-gray-400 group-hover/item:text-white uppercase tracking-widest transition-colors">{exam}</span>
                                                </div>
                                                <ArrowRight size={14} className="text-lh-purple opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-2 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </PrecisionPanel>

                        <PrecisionPanel className="p-5 md:p-10 bg-lh-purple/5 border-lh-purple/10 relative overflow-hidden group/voucher">
                            {/* Small mascot accent */}
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 opacity-5 group-hover/voucher:opacity-10 transition-opacity">
                                <img src={ngdPic} alt="" className="w-full h-full object-contain -rotate-12" />
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-4 md:mb-6 relative z-10 gap-4 text-center md:text-left">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                                    <Lock size={18} className="text-lh-purple" /> VOUCHER / ACCESS CODE
                                </h3>
                                <HelpCircle size={16} className="text-gray-600 cursor-help hover:text-white transition-colors" />
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-8 relative z-10 opacity-70 text-center md:text-left">
                                Enter a private authorization code for restricted certification tiers.
                            </p>
                            <div className="flex gap-3 relative z-10">
                                <input
                                    type="text"
                                    placeholder="Enter Code"
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-[11px] font-black text-white focus:outline-none focus:border-lh-purple/50 uppercase tracking-[0.3em] font-mono"
                                />
                                <button className="bg-lh-purple text-white px-6 py-4 rounded-xl hover:bg-white hover:text-lh-dark transition-all transform active:scale-95 flex items-center justify-center shadow-lg shadow-lh-purple/20">
                                    <ChevronRight size={18} className="rotate-0 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </PrecisionPanel>
                    </div>

                    {/* Exam List Area */}
                    <div className="lg:col-span-8 space-y-6 md:space-y-8">
                        <PrecisionPanel className="p-5 md:p-10 border-white/5 shadow-2xl">
                            <div className="mb-6 md:mb-10 p-5 md:p-8 bg-white/[0.02] border border-white/10 rounded-[2rem] border-t-4 md:border-t-0 md:border-l-4 border-lh-purple relative group/note text-center md:text-left">
                                <p className="text-[13px] text-gray-400 font-bold leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                    Select a certification group below to view specific examination parameters and proceed with the registration sequence. <br className="hidden md:block" />
                                    <span className="text-lh-purple font-black">Note:</span> Only one sector may be active at any given time.
                                </p>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                {filteredExams.map((exam, idx) => (
                                    <div key={idx} className="space-y-px">
                                        <motion.button
                                            whileHover={{ x: 10 }}
                                            onClick={() => setActiveGroup(activeGroup === idx ? null : idx)}
                                            className={`w-full flex flex-col md:flex-row items-center md:justify-between p-6 md:p-8 rounded-[2rem] transition-all duration-500 border gap-6 md:gap-0 ${activeGroup === idx ? 'bg-lh-purple/10 border-lh-purple/30 text-white shadow-[0_20px_50px_rgba(188,19,254,0.1)]' : 'bg-white/[0.03] border-white/5 text-gray-500 hover:bg-white/10 hover:border-white/20 hover:text-white'} group/row`}
                                        >
                                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeGroup === idx ? 'bg-lh-purple text-white shadow-xl rotate-6' : 'bg-lh-purple/10 text-lh-purple group-hover/row:scale-110'}`}>
                                                    <Shield size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-[13px] md:text-[14px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] font-mono block mb-1 leading-tight">{exam}</span>
                                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block opacity-70">Certification_Node_Active</span>
                                                </div>
                                            </div>
                                            <div className={`p-2 rounded-full transition-all duration-500 ${activeGroup === idx ? 'bg-lh-purple text-white rotate-180' : 'bg-white/5 text-gray-700 group-hover:text-lh-purple group-hover:bg-white/10'}`}>
                                                <ChevronDown size={20} />
                                            </div>
                                        </motion.button>

                                        <AnimatePresence>
                                            {activeGroup === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.5, ease: "circOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-6 pt-2 space-y-3">
                                                        <motion.button
                                                            initial={{ x: -20, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: 0.1 }}
                                                            onClick={() => navigate('/dashboard/select-exam-options', { state: { examName: exam } })}
                                                            className="w-full text-left p-4 md:p-6 rounded-[1.5rem] bg-white/[0.03] hover:bg-lh-purple/20 border border-white/10 hover:border-lh-purple/40 transition-all group/action flex flex-col md:flex-row items-center md:justify-between shadow-lg gap-6 md:gap-0"
                                                        >
                                                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 text-center md:text-left">
                                                                <div className="p-2 bg-lh-purple/20 rounded-lg group-hover/action:bg-lh-purple transition-colors">
                                                                    <CheckCircle2 size={16} className="text-white" />
                                                                </div>
                                                                <div>
                                                                    <span className="text-[11px] md:text-[12px] font-black uppercase tracking-widest text-white block mb-1">Schedule_Exam_Now</span>
                                                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block opacity-60">Initiate Secure Pearson VUE Interface</span>
                                                                </div>
                                                            </div>
                                                            <ArrowRight size={18} className="text-lh-purple opacity-40 group-hover/action:opacity-100 md:group-hover/action:translate-x-4 transition-all" />
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}

                                {filteredExams.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="py-32 text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-black/40 relative overflow-hidden group/empty"
                                    >
                                        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover/empty:opacity-100 transition-opacity"></div>
                                        <div className="relative z-10">
                                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:border-lh-purple/30 transition-all">
                                                <Search size={32} className="text-gray-800 opacity-50" />
                                            </div>
                                            <p className="text-gray-500 text-[12px] font-black uppercase tracking-[0.6em] opacity-60">No matching registry entries detected</p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </PrecisionPanel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindExam;
