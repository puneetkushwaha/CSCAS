import React from "react";
import { Info, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrecisionPanel = ({ children, className = "" }) => (
  <div className={`relative bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden group transition-all duration-700 ${className}`}>
    {/* Subtle hover glow */}
    <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
    {/* Top intensity line */}
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const InputField = ({ label, required, placeholder, ...props }) => (
  <div className="space-y-3 text-left">
    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
      {label}{required && <span className="text-lh-purple">*</span>}
    </label>
    <div className="relative group/field">
      <input
        {...props}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white text-[12px] font-bold focus:outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.02] transition-all placeholder:text-gray-700 shadow-inner"
      />
    </div>
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-4 border-b border-white/5 pb-3 mb-6">
    <div className="w-1.5 h-1.5 rounded-full bg-lh-purple"></div>
    <h3 className="text-[10px] font-black text-lh-purple uppercase tracking-[0.4em] italic">{title}</h3>
  </div>
);

const Exam = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard/pearson');
  };

  return (
    <div className="min-h-full flex flex-col relative pb-20">
      <div className="max-w-[1200px] mx-auto w-full py-8">
        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <PrecisionPanel className="p-8 md:p-10 border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.7)]">
            <header className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-2 bg-lh-purple rounded-full shadow-[0_0_15px_rgba(188,19,254,0.6)] animate-pulse"></div>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">REGISTRY_IDENTITY_HUD / v2.1</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 uppercase italic leading-none">
                Schedule <span className="text-lh-purple">Exams</span>
              </h1>
              <p className="text-sm text-gray-400 font-bold max-w-3xl leading-relaxed italic border-l-2 border-lh-purple/30 pl-6">
                Confirm your identity metrics to synchronize with global testing nodes and initiate the certification sequence.
              </p>
            </header>

            {/* CRITICAL NOTICE */}
            <div className="bg-lh-purple/5 border-l-2 border-lh-purple p-6 mb-12 rounded-r-2xl border-y border-r border-white/5 shadow-inner group">
              <div className="flex gap-6 items-start">
                <div className="p-3 bg-lh-purple/10 rounded-xl group-hover:scale-110 transition-transform duration-500">
                  <Info className="w-5 h-5 text-lh-purple shrink-0" />
                </div>
                <div className="space-y-2 pt-1">
                  <h4 className="text-[9px] font-black text-lh-purple uppercase tracking-[0.4em] italic">CRITICAL_IDENTITY_ALERT:</h4>
                  <p className="text-[12px] text-gray-300 font-bold leading-relaxed tracking-wide">
                    Your legal identity nodes <span className="text-white italic underline decoration-lh-purple/30 underline-offset-4 font-black">MUST MATCH</span> your official documentation. Any delta during biometric check-in will result in immediate session termination.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-16">
              {/* LEGAL NAME Sections */}
              <div className="space-y-12">
                <SectionHeader title="OFFICIAL_REGISTRY_NAME" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <InputField label="FIRST NAME" required placeholder="GIVEN_NAME" />
                  <InputField label="Middle Name" placeholder="SECONDARY_IDENTIFIER" />
                  <InputField label="LAST NAME" required placeholder="SURNAME" />
                  <InputField label="Suffix" placeholder="IDENTITY_SUFFIX" />
                </div>
              </div>

              {/* PREFERRED NAME */}
              <div className="space-y-12">
                <SectionHeader title="PREFERRED_SESSION_ALIAS" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <InputField label="FIRST NAME" placeholder="ALIAS_FIRST" />
                  <InputField label="LAST NAME" placeholder="ALIAS_LAST" />
                </div>
              </div>

              {/* CONTACT INFORMATION */}
              <div className="space-y-8 pt-10 border-t border-white/5">
                <SectionHeader title="COMMUNICATION_RELAY_DATA" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <InputField label="COUNTRY CODE" value="+1" readOnly />
                  <InputField label="Phone" placeholder="PRIMARY_RELAY_NUMBER*" required />
                  <InputField label="COUNTRY CODE" value="+1" readOnly />
                  <InputField label="Mobile Phone" placeholder="SECONDARY_MOBILE_RELAY" />
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">RESIDENCE_SECTOR (COUNTRY)*</label>
                  <div className="relative group/select">
                    <select className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white text-[12px] font-bold appearance-none outline-none group-hover/select:border-lh-purple/50 transition-all shadow-inner cursor-pointer">
                      <option className="bg-[#0a0a0a]">United States</option>
                      <option className="bg-[#0a0a0a]">India</option>
                      <option className="bg-[#0a0a0a]">Canada</option>
                      <option className="bg-[#0a0a0a]">United Kingdom</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-lh-purple transition-transform group-hover/select:translate-y-[-40%]">
                      <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-4 bg-lh-purple hover:bg-white text-white hover:text-lh-dark px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(188,19,254,0.3)] transform hover:scale-105 active:scale-95 transition-all group"
                >
                  INITIALIZE_REVIEW
                  <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </form>
          </PrecisionPanel>
        </motion.div>
      </div>
    </div>
  );
};

export default Exam;
