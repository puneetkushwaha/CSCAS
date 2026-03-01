import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Shield, ArrowLeft, Monitor, ChevronLeft,
    Clock, Laptop, Home, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

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
    const navigate = useNavigate();
    const location = useLocation();
    const examName = location.state?.examName || "CSCA Certification Exam";
    const examId = location.state?.examId;

    const [selectedOption, setSelectedOption] = useState(null);
    const [isPageLoading, setIsPageLoading] = useState(true);

    // System Check State
    const [systemCheckStatus, setSystemCheckStatus] = useState('idle'); // idle, testing, passed, failed
    const [checkError, setCheckError] = useState("");
    const [checks, setChecks] = useState({
        secureSector: false,
        identityData: false,
        preCheck: false
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsPageLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const runSystemCheck = async () => {
        setSystemCheckStatus('testing');
        setCheckError("");

        try {
            // 1. Check Network
            if (!navigator.onLine) {
                throw new Error("No internet connection detected.");
            }

            // 2. Request Camera & Mic Permissions
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            // Immediately stop tracks since we only needed to verify permission
            stream.getTracks().forEach(track => track.stop());

            setTimeout(() => setSystemCheckStatus('passed'), 1500); // Small delay for visual UX

        } catch (error) {
            console.error("System check failed:", error);
            setSystemCheckStatus('failed');
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                setCheckError("Camera/Mic access denied. Please allow permissions in your browser.");
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                setCheckError("No camera or microphone found.");
            } else {
                setCheckError(error.message || "System check failed. Please ensure your hardware is connected.");
            }
        }
    };

    const toggleCheck = (key) => {
        setChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const isNextEnabled = selectedOption === 'online' && systemCheckStatus === 'passed' && Object.values(checks).every(Boolean);

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

                        <AnimatePresence>
                            {selectedOption === 'online' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-8 mt-4">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                            <h6 className="text-[12px] font-black uppercase tracking-widest text-white">
                                                Prepare to take your exam with <span className="text-lh-purple">OnVUE</span>
                                            </h6>
                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                                Complete all requirements to proceed
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Compute Node (Interactive Test) */}
                                            <div
                                                className={`p-5 rounded-2xl border transition-all ${systemCheckStatus === 'passed' ? 'bg-green-500/10 border-green-500/30' : systemCheckStatus === 'failed' ? 'bg-red-500/10 border-red-500/30' : 'bg-white/[0.03] border-white/10 hover:border-lh-purple/30'}`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-xl ${systemCheckStatus === 'passed' ? 'bg-green-500/20 text-green-400' : systemCheckStatus === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-lh-purple/10 text-lh-purple'}`}>
                                                        {systemCheckStatus === 'testing' ? <Loader2 size={20} className="animate-spin" /> : <Laptop size={20} />}
                                                    </div>
                                                    <div className="flex-1 space-y-2 text-left">
                                                        <div className="flex items-center justify-between">
                                                            <h6 className="text-[10px] font-black uppercase tracking-widest text-white">Compute Node</h6>
                                                            {systemCheckStatus === 'passed' && <CheckCircle2 size={16} className="text-green-500" />}
                                                            {systemCheckStatus === 'failed' && <AlertTriangle size={16} className="text-red-500" />}
                                                        </div>
                                                        <p className="text-[9px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">
                                                            Test Internet, Webcam & Microphone.
                                                        </p>

                                                        {systemCheckStatus !== 'passed' && (
                                                            <button
                                                                onClick={runSystemCheck}
                                                                disabled={systemCheckStatus === 'testing'}
                                                                className="mt-3 text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-lh-purple/20 text-lh-purple rounded-lg hover:bg-lh-purple hover:text-white transition-all w-full"
                                                            >
                                                                {systemCheckStatus === 'testing' ? 'Testing...' : systemCheckStatus === 'failed' ? 'Retry Test' : 'Run System Check'}
                                                            </button>
                                                        )}
                                                        {checkError && <p className="text-[8px] text-red-400 mt-2 tracking-wide font-bold">{checkError}</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Secure Sector */}
                                            <button
                                                onClick={() => toggleCheck('secureSector')}
                                                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 text-left ${checks.secureSector ? 'bg-lh-purple/10 border-lh-purple/50' : 'bg-white/[0.03] border-white/10 hover:border-lh-purple/30'}`}
                                            >
                                                <div className={`p-3 rounded-xl transition-colors ${checks.secureSector ? 'bg-lh-purple/20 text-lh-purple' : 'bg-white/5 text-gray-400'}`}>
                                                    <Home size={20} />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <h6 className="text-[10px] font-black uppercase tracking-widest text-white">Secure Sector</h6>
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checks.secureSector ? 'bg-lh-purple border-lh-purple' : 'border-gray-600'}`}>
                                                            {checks.secureSector && <CheckCircle2 size={12} className="text-white" />}
                                                        </div>
                                                    </div>
                                                    <p className="text-[8px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest">
                                                        I confirm I have a distraction-free space.
                                                    </p>
                                                </div>
                                            </button>

                                            {/* Identity Data */}
                                            <button
                                                onClick={() => toggleCheck('identityData')}
                                                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 text-left ${checks.identityData ? 'bg-lh-purple/10 border-lh-purple/50' : 'bg-white/[0.03] border-white/10 hover:border-lh-purple/30'}`}
                                            >
                                                <div className={`p-3 rounded-xl transition-colors ${checks.identityData ? 'bg-lh-purple/20 text-lh-purple' : 'bg-white/5 text-gray-400'}`}>
                                                    <ShieldCheck size={20} />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <h6 className="text-[10px] font-black uppercase tracking-widest text-white">Identity Data</h6>
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checks.identityData ? 'bg-lh-purple border-lh-purple' : 'border-gray-600'}`}>
                                                            {checks.identityData && <CheckCircle2 size={12} className="text-white" />}
                                                        </div>
                                                    </div>
                                                    <p className="text-[8px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest">
                                                        I have a valid Government ID ready.
                                                    </p>
                                                </div>
                                            </button>

                                            {/* Pre-check */}
                                            <button
                                                onClick={() => toggleCheck('preCheck')}
                                                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 text-left ${checks.preCheck ? 'bg-lh-purple/10 border-lh-purple/50' : 'bg-white/[0.03] border-white/10 hover:border-lh-purple/30'}`}
                                            >
                                                <div className={`p-3 rounded-xl transition-colors ${checks.preCheck ? 'bg-lh-purple/20 text-lh-purple' : 'bg-white/5 text-gray-400'}`}>
                                                    <Clock size={20} />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <h6 className="text-[10px] font-black uppercase tracking-widest text-white">Pre-check</h6>
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checks.preCheck ? 'bg-lh-purple border-lh-purple' : 'border-gray-600'}`}>
                                                            {checks.preCheck && <CheckCircle2 size={12} className="text-white" />}
                                                        </div>
                                                    </div>
                                                    <p className="text-[8px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest">
                                                        I understand I must authenticate 30m prior.
                                                    </p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 flex gap-4 transition-all">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-8 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/10 transition-all font-mono"
                        >
                            PREVIOUS
                        </button>
                        <button
                            disabled={!isNextEnabled}
                            onClick={() => navigate('/dashboard/select-exam-language', { state: { examName, examId, selectedOption } })}
                            className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-mono flex items-center gap-3 active:scale-95 ${isNextEnabled
                                ? 'bg-lh-purple text-white shadow-[0_10px_30px_rgba(188,19,254,0.3)] hover:scale-105'
                                : 'bg-white/[0.02] text-gray-800 cursor-not-allowed border border-white/5'
                                }`}
                        >
                            NEXT_STEP
                            <ArrowRight size={14} className={isNextEnabled ? 'animate-bounce-x' : ''} />
                        </button>
                    </div>
                </PrecisionPanel>
            </div>
        </div>
    );
};

export default SelectExamOptions;
