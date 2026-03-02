import React from 'react';
import { Settings, Bell, Shield, Lock, ArrowLeft, Check, Loader2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/70 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const RegistryPreferences = () => {
    const navigate = useNavigate();
    const [isSyncing, setIsSyncing] = React.useState(false);
    const [preferences, setPreferences] = React.useState({
        visibility: true,
        analytics: false,
        encryption: true
    });

    const togglePreference = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
        toast.success(`Preference Updated: ${key.charAt(0).toUpperCase() + key.slice(1)}`);
    };

    const handleInitiateAudit = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            toast.success('Security Audit Completed: Registry Integrity Verified');
        }, 2000);
    };

    const prefItems = [
        { id: 'visibility', label: 'Public Profile Visibility', desc: 'Allow other operators to view your certification status.' },
        { id: 'analytics', label: 'Advanced Analytics Relay', desc: 'Share anonymized testing data for registry optimization.' },
        { id: 'encryption', label: 'Secure Storage Protocol', desc: 'Encrypt all locally stored session information.' }
    ];

    return (
        <div className="space-y-12 pb-16 relative">
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-lh-purple/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto w-full pt-4 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] hover:text-lh-purple transition-colors mb-10 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
                    Back_To_Dashboard
                </button>

                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-1 bg-lh-purple rounded-full"></div>
                        <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.5em]">Configuration_Terminal</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        REGISTRY <span className="text-transparent font-black" style={{ WebkitTextStroke: '1px #bc13fe' }}>PREFERENCES</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8">
                        <PrecisionPanel className="p-12">
                            <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                                <Shield size={18} className="text-lh-purple" /> Privacy_Parameters
                            </h3>

                            <div className="space-y-8">
                                {prefItems.map((pref) => (
                                    <div key={pref.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all">
                                        <div className="space-y-1">
                                            <p className="text-[12px] font-black text-white uppercase tracking-wider">{pref.label}</p>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{pref.desc}</p>
                                        </div>
                                        <div
                                            onClick={() => togglePreference(pref.id)}
                                            className={`w-14 h-7 rounded-full relative p-1 cursor-pointer transition-colors duration-500 ${preferences[pref.id] ? 'bg-lh-purple shadow-[0_0_20px_rgba(188,19,254,0.4)]' : 'bg-white/10'}`}
                                        >
                                            <motion.div
                                                animate={{ x: preferences[pref.id] ? 28 : 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                className="w-5 h-5 bg-white rounded-full shadow-lg"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PrecisionPanel>
                    </div>

                    <div className="lg:col-span-4">
                        <PrecisionPanel className="p-10 bg-lh-purple/5 border-lh-purple/10">
                            <div className="w-16 h-16 rounded-2xl bg-lh-purple flex items-center justify-center mb-8 shadow-xl">
                                <Lock size={28} className="text-white" />
                            </div>
                            <h3 className="text-[14px] font-black text-white uppercase tracking-widest mb-4">Security_Audit</h3>
                            <p className="text-[11px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest opacity-70 mb-8">
                                Last registry synchronization occurred: <br /><span className="text-lh-purple">24_MIN_AGO</span>
                            </p>
                            <button
                                onClick={handleInitiateAudit}
                                disabled={isSyncing}
                                className="w-full py-4 bg-white text-lh-dark text-[10px] font-black uppercase tracking-[0.4em] rounded-xl hover:bg-lh-purple hover:text-white transition-all transform active:scale-95 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSyncing ? (
                                    <>
                                        <RotateCcw size={14} className="animate-spin" />
                                        AUDITING_REGISTRY...
                                    </>
                                ) : (
                                    'Initiate Audit'
                                )}
                            </button>
                        </PrecisionPanel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistryPreferences;
