import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ChevronRight, Lock, Activity, Globe, Info, UserCircle2, ArrowRight } from 'lucide-react';

const PrecisionPanel = ({ children, className = "" }) => (
  <div className={`relative bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
    <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const Exam = () => {
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-lh-dark">
      <div className="w-12 h-12 border-t-2 border-r-2 border-lh-purple rounded-full animate-spin mb-6"></div>
      <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Initializing_Registry_HUD</span>
    </div>
  );

  return (
    <div className="space-y-12 pb-16 relative">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-1.5 bg-lh-purple rounded-full shadow-[0_0_10px_#bc13fe]"></div>
          <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.5em]">Pearson_VUE_Secure_Terminal</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
          Registry <span className="text-lh-purple">Initialization</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-10">
          <PrecisionPanel className="p-10 border-white/5 shadow-2xl">
            <div className="flex items-center gap-5 border-b border-white/5 pb-8 mb-8">
              <div className="w-12 h-12 bg-lh-purple/10 border border-lh-purple/20 rounded-2xl flex items-center justify-center">
                <UserCircle2 className="text-lh-purple" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase text-white tracking-tight">CANDIDATE_PROFILE</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Verify Operational Identity</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'OFFICIAL_REGISTRY_NAME', value: 'PUNEET KUSHWAHA' },
                { label: 'CANDIDATE_ID', value: 'CSCA-88B2-99F1' },
                { label: 'ACCESS_LEVEL', value: 'PROFESSIONAL_OPERATOR' },
                { label: 'STATUS', value: 'VERIFIED_ACTIVE' }
              ].map((field, i) => (
                <div key={i} className="space-y-2 group">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block transition-colors group-hover:text-lh-purple">{field.label}</label>
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-[12px] font-black text-white uppercase tracking-widest shadow-inner">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-lh-purple/5 border border-lh-purple/10 rounded-2xl flex items-start gap-4">
              <Info size={16} className="text-lh-purple shrink-0 mt-1" />
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                Note: Information provided above must match your legal identification document exactly. Discrepancies will result in session termination.
              </p>
            </div>
          </PrecisionPanel>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard/pearson')}
              className="px-10 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white transition-all shadow-xl"
            >
              ABORT_SEQUENCE
            </button>
            <button
              onClick={() => navigate('/dashboard/find-exam')}
              className="flex-1 py-4 bg-lh-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-lh-dark transition-all shadow-[0_20px_40px_rgba(188,19,254,0.3)] flex items-center justify-center gap-3 group"
            >
              PROCEED_TO_REGISTRY <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <PrecisionPanel className="p-8 border-lh-purple/10">
            <h4 className="text-[11px] font-black text-lh-purple uppercase tracking-[0.4em] mb-8 pb-4 border-b border-white/5 flex items-center gap-2">
              <Activity size={14} className="animate-pulse" /> SESSIONS_HUD
            </h4>
            <div className="space-y-6">
              {[
                { label: 'Sync_Integrity', status: 'OPTIMAL' },
                { label: 'Identity_Link', status: 'AUTHENTICATED' },
                { label: 'Node_Status', status: 'READY' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="text-lh-purple">{item.status}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-lh-purple"
                      animate={{ width: ["70%", "95%", "85%"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PrecisionPanel>

          <PrecisionPanel className="p-8 bg-lh-purple rounded-[2.5rem] shadow-[0_20px_50px_rgba(188,19,254,0.3)] overflow-hidden">
            <Lock size={48} className="absolute -bottom-4 -right-4 text-white/10 rotate-12" />
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-4">Integrity_Guard</h4>
            <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest leading-relaxed">
              Pearson VUE security protocols are active. Browser fingerprinting and biometric verification are required for node access.
            </p>
          </PrecisionPanel>
        </div>
      </div>
    </div>
  );
};

export default Exam;
