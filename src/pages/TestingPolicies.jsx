import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Shield, ChevronLeft, Menu, User, MessageSquare, LogOut, FileText, CheckCircle2, AlertCircle, ArrowRight
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
            <span className="text-[9px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Loading Policies...</span>
        </div>
    </div>
);

const TestingPolicies = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const examName = location.state?.examName || "CSCA Certification Exam";
    const temporaryCountry = location.state?.temporaryCountry;
    const hasAuthorization = location.state?.hasAuthorization;
    const selectedLanguage = location.state?.selectedLanguage;
    const selectedOption = location.state?.selectedOption;

    const [isPageLoading, setIsPageLoading] = useState(true);
    const [agreedOnlinePolicy, setAgreedOnlinePolicy] = useState(false);
    const [agreedCSCAPolicy, setAgreedCSCAPolicy] = useState(false);

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
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Testing <span className="text-lh-purple text-transparent" style={{ WebkitTextStroke: '1px #bc13fe' }}>Policies</span></h2>
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

                    <div className="space-y-12 h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                        {/* Policy Section 1 */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-lh-purple" />
                                <h3 className="text-lg font-black text-white uppercase italic tracking-widest">Online exam policies</h3>
                            </div>
                            <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 text-[11px] font-bold text-gray-400 leading-relaxed space-y-4 italic opacity-80">
                                <p>To proceed with this session, you must acknowledge the following data processing and behavioral protocols.</p>
                                <p>By accessing this node, you understand and agree to the video and audio recording of your entire testing session. Data will be transmitted via secure relay to centralized storage nodes.</p>
                                <h4 className="text-white uppercase tracking-widest">Procedural Integrity</h4>
                                <p>Proctors maintain active oversight. Any deviation from the established protocol (third-party presence, unauthorized hardware, verbal communication) will trigger immediate termination of the operational instance with zero score output and no credit refund.</p>
                                <h4 className="text-white uppercase tracking-widest">Identity Authentication</h4>
                                <p>Facial comparison telemetry will be utilized during check-in. Visual evidence of the testing workspace must be uploaded for clearance.</p>
                            </div>

                            <label className="flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.03] cursor-pointer hover:bg-lh-purple/5 transition-all group">
                                <div className="relative flex items-center mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={agreedOnlinePolicy}
                                        onChange={(e) => setAgreedOnlinePolicy(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 rounded-md border-2 border-gray-600 peer-checked:border-lh-purple peer-checked:bg-lh-purple transition-all flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-lh-purple transition-colors italic">Acknowledge_Online_Policies</span>
                                </div>
                            </label>
                        </div>

                        {/* Policy Section 2 */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-t border-white/5 pt-8">
                                <Shield className="w-5 h-5 text-lh-purple" />
                                <h3 className="text-lg font-black text-white uppercase italic tracking-widest">CSCA Testing Protocols</h3>
                            </div>
                            <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 text-[11px] font-bold text-gray-400 leading-relaxed space-y-6 italic opacity-80">
                                <div className="space-y-2">
                                    <h4 className="text-white uppercase tracking-widest underline decoration-lh-purple/30 underline-offset-4">Admission_Criteria</h4>
                                    <p>Deploy 30 minutes prior to mission clock. Valid government-issued ID required. Late arrival ({'>'}15m) results in mission failure.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-white uppercase tracking-widest underline decoration-lh-purple/30 underline-offset-4">Sector_Clearance</h4>
                                    <p>Workspace must be isolated and distraction-free. No additional sub-monitors. Desk must be clear of all non-essential hardware.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-white uppercase tracking-widest underline decoration-lh-purple/30 underline-offset-4">Reschedule_Relay</h4>
                                    <p>Modifications allowed prior to T-minus-0. Failure to notify results in fee forfeiture.</p>
                                </div>
                            </div>

                            <label className="flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.03] cursor-pointer hover:bg-lh-purple/5 transition-all group">
                                <div className="relative flex items-center mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={agreedCSCAPolicy}
                                        onChange={(e) => setAgreedCSCAPolicy(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 rounded-md border-2 border-gray-600 peer-checked:border-lh-purple peer-checked:bg-lh-purple transition-all flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-lh-purple transition-colors italic">Initiate_CSCA_Agreement</span>
                                </div>
                            </label>
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
                            disabled={!agreedOnlinePolicy || !agreedCSCAPolicy}
                            onClick={() => navigate('/dashboard/select-proctor-language', { state: { examName, temporaryCountry, hasAuthorization, selectedLanguage, selectedOption } })}
                            className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-mono flex items-center gap-3 active:scale-95 ${(agreedOnlinePolicy && agreedCSCAPolicy)
                                ? 'bg-lh-purple text-white shadow-[0_10px_30px_rgba(188,19,254,0.3)] hover:scale-105'
                                : 'bg-white/[0.02] text-gray-800 cursor-not-allowed border border-white/5'
                                }`}
                        >
                            I_AGREE_-_NEXT
                            <ArrowRight size={14} className={(agreedOnlinePolicy && agreedCSCAPolicy) ? 'animate-bounce-x' : ''} />
                        </button>
                    </div>
                </PrecisionPanel>
            </div>
        </div>
    );
};

export default TestingPolicies;
