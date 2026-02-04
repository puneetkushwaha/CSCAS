import React from 'react';
import { User, Shield, Activity, Globe, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/70 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const AccountIntel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="space-y-12 pb-16 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lh-purple/5 blur-[150px] rounded-full pointer-events-none"></div>

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
                        <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.5em] italic">System_Intel</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                        MY ACCOUNT <span className="text-transparent font-black" style={{ WebkitTextStroke: '1px #bc13fe' }}>INTEL</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        <PrecisionPanel className="p-12">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-20 h-20 rounded-full bg-lh-purple/20 border border-lh-purple/40 flex items-center justify-center">
                                    <User size={32} className="text-lh-purple" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{user?.firstName} {user?.lastName}</h3>
                                    <p className="text-lh-purple font-mono text-[10px] tracking-widest uppercase mt-2">{user?.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { label: 'Operator ID', value: `CSCA_${user?._id?.slice(-6).toUpperCase() || 'UNINITIALIZED'}`, icon: <Shield size={18} /> },
                                    { label: 'Security Tier', value: 'Professional_Level_01', icon: <Activity size={18} /> },
                                    { label: 'Access Region', value: 'Global_Relay_Nodes', icon: <Globe size={18} /> },
                                    { label: 'System Status', value: 'Operational_Online', icon: <Info size={18} /> }
                                ].map((item, i) => (
                                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group/item hover:border-lh-purple/20 transition-all">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-2 bg-lh-purple/10 rounded-lg text-lh-purple group-hover/item:scale-110 transition-transform">
                                                {item.icon}
                                            </div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                                        </div>
                                        <p className="text-sm font-black text-white uppercase tracking-wider font-mono italic">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </PrecisionPanel>
                    </div>

                    <div className="lg:col-span-4">
                        <PrecisionPanel className="p-10 border-white/5 h-full">
                            <h3 className="text-[10px] font-black text-lh-purple uppercase tracking-[0.4em] mb-8 italic">Registry_Logs</h3>
                            <div className="space-y-6">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-px h-full bg-white/10 relative">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-lh-purple"></div>
                                        </div>
                                        <div className="pb-6">
                                            <p className="text-[9px] text-gray-500 font-mono mb-1 italic">TIME_SYNC_{i + 1}_UTC</p>
                                            <p className="text-[10px] text-white font-black uppercase tracking-wider italic">Session Protocol Initiated</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PrecisionPanel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountIntel;
