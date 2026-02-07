import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Shield, ChevronLeft, Calendar, Clock, Globe, Check, XCircle, ChevronRight, ArrowRight, Sun, Sunrise, Sunset, Moon, ChevronDown, Activity
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
            <span className="text-[9px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Initializing Calendar...</span>
        </div>
    </div>
);

const FindAppointment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { examName, temporaryCountry, hasAuthorization, selectedLanguage, selectedOption, proctorLanguage } = location.state || {};
    const displayExamName = examName || "CSCA Certification Exam";

    const [isPageLoading, setIsPageLoading] = useState(true);
    const [detectedTimeZone, setDetectedTimeZone] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [isTimeZoneConfirmed, setIsTimeZoneConfirmed] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isTimeFormat24, setIsTimeFormat24] = useState(true);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [expandedGroup, setExpandedGroup] = useState(1);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    const timeGroups = [
        { id: 0, label: '00:00 - 09:00', available: 7, icon: Moon, color: 'from-slate-900 to-lh-purple/20', slots: ['03:45', '04:15', '05:15', '05:30', '05:45', '06:00', '06:15'] },
        { id: 1, label: '09:15 - 17:00', available: 0, icon: Sun, color: 'from-lh-purple/30 to-white/5', slots: [] },
        { id: 2, label: '17:15 - 21:00', available: 2, icon: Sunset, color: 'from-lh-purple/50 to-orange-500/10', slots: ['19:30', '20:45'] },
        { id: 3, label: '21:15 - 23:59', available: 4, icon: Moon, color: 'from-lh-purple/40 to-indigo-900/20', slots: ['21:15', '22:00', '22:30', '23:00'] }
    ];

    useEffect(() => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setDetectedTimeZone(tz);
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        const timer = setTimeout(() => setIsPageLoading(false), 800);
        return () => { clearTimeout(timer); clearInterval(interval); };
    }, []);

    const handleImmediateAccess = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        navigate('/dashboard/review-booking', {
            state: {
                ...location.state,
                confirmedTimeZone: detectedTimeZone,
                appointmentDate: `${year}-${month}-${day}`,
                appointmentTime: `${hours}:${minutes}`,
                isImmediate: true
            }
        });
    };

    const handleBookAppointment = () => {
        navigate('/dashboard/review-booking', {
            state: {
                ...location.state,
                confirmedTimeZone: detectedTimeZone,
                appointmentDate: selectedDate ? `2026-02-${selectedDate.toString().padStart(2, '0')}` : null,
                appointmentTime: selectedTimeSlot || '06:15'
            }
        });
    };

    if (isPageLoading) return <GlobalPageLoader />;

    return (
        <div className="min-h-full flex flex-col relative pb-12">
            <div className="max-w-[1000px] mx-auto w-full pt-4 space-y-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => isTimeZoneConfirmed ? setIsTimeZoneConfirmed(false) : navigate(-1)}
                        className="flex items-center gap-2 text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-widest group transition-colors"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        back
                    </button>
                    <div className="px-3 py-1 bg-lh-purple/10 border border-lh-purple/20 rounded-lg text-[8px] font-black text-lh-purple uppercase tracking-widest animate-pulse">
                        UPLINK_STABLE
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Find an <span className="text-lh-purple text-transparent" style={{ WebkitTextStroke: '1px #bc13fe' }}>appointment</span></h2>
                </div>

                <PrecisionPanel className="p-8 border-white/5 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center gap-5 border-b border-white/5 pb-6 mb-8">
                        <div className="p-3 bg-lh-purple/10 rounded-xl">
                            <Shield size={20} className="text-lh-purple" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-lh-purple uppercase tracking-widest mb-1">Registry_Active_Node:</p>
                            <h4 className="text-xl font-black uppercase tracking-tight text-white">{displayExamName}</h4>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {/* Section 1: Time Zone */}
                        <div className={`transition-all duration-500 ${isTimeZoneConfirmed ? 'opacity-30 pointer-events-none scale-95 blur-[1px]' : 'opacity-100'}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <Globe className="w-5 h-5 text-lh-purple" />
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">1. Confirm session time zone</h4>
                            </div>

                            <div className="pl-9 space-y-5">
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-black text-lh-purple bg-lh-purple/10 px-4 py-2 rounded-xl border border-lh-purple/20">
                                        {detectedTimeZone}
                                    </span>
                                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">({currentTime})</span>
                                </div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-lg">
                                    System detects regional uplink. Confirm to lock synchronization.
                                </p>
                                <button
                                    onClick={() => setIsTimeZoneConfirmed(true)}
                                    className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-lh-purple text-white hover:scale-105 transition-all flex items-center gap-3 active:scale-95 shadow-xl shadow-lh-purple/20"
                                >
                                    <Check size={14} /> Synchronize Zone
                                </button>
                            </div>
                        </div>

                        {/* BETA TEST: Immediate Access */}
                        <div className="bg-lh-purple/5 border border-lh-purple/20 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-lh-purple rounded-xl shadow-[0_0_20px_rgba(188,19,254,0.4)] group-hover:rotate-12 transition-transform">
                                    <Activity size={20} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Testing Protocol: START NOW</h4>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest opacity-70">Bypass scheduling for immediate session validation.</p>
                                </div>
                            </div>
                            <button
                                onClick={handleImmediateAccess}
                                className="px-8 py-3 bg-white text-lh-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lh-purple hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-3 shrink-0"
                            >
                                INITIALize_IMMEDIATE_MISSION <ArrowRight size={14} />
                            </button>
                        </div>

                        {/* Section 2: Date Selection */}
                        {isTimeZoneConfirmed && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`transition-all duration-500 ${selectedDate ? 'opacity-30 pointer-events-none scale-95 blur-[1px]' : 'opacity-100'}`}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <Calendar className="w-5 h-5 text-lh-purple" />
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">2. Select operational date</h4>
                                </div>

                                <div className="pl-9 space-y-6">
                                    <div className="max-w-sm bg-black/40 border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 inset-x-0 h-px bg-lh-purple/20"></div>
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">February 2026</span>
                                            <div className="flex gap-2">
                                                <button className="p-1 hover:text-lh-purple transition-colors"><ChevronLeft size={16} /></button>
                                                <button className="p-1 hover:text-lh-purple transition-colors"><ChevronRight size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                                <div key={i} className="text-[8px] font-black text-gray-600 uppercase mb-2">{d}</div>
                                            ))}
                                            {[...Array(31)].map((_, i) => {
                                                const d = i + 1;
                                                const avail = [5, 12, 14, 15, 20, 21, 24].includes(d);
                                                return (
                                                    <button
                                                        key={i}
                                                        disabled={!avail}
                                                        onClick={() => setSelectedDate(d)}
                                                        className={`h-8 w-8 flex items-center justify-center rounded-lg text-[9px] font-black transition-all ${selectedDate === d ? 'bg-lh-purple text-white shadow-lg shadow-lh-purple/40 scale-110' : avail ? 'text-white hover:bg-lh-purple/20' : 'text-gray-800 cursor-not-allowed'}`}
                                                    >
                                                        {d}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {selectedDate && (
                                        <button onClick={() => setSelectedDate(null)} className="text-[9px] font-black text-lh-purple uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                                            <XCircle size={14} /> Change Node Date
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Section 3: Time Selection */}
                        {selectedDate && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 mb-6 border-t border-white/5 pt-8">
                                    <Clock className="w-5 h-5 text-lh-purple" />
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">3. Configure Session Time</h4>
                                </div>

                                <div className="pl-9 space-y-6">
                                    <div onClick={() => setShowTimeModal(true)} className="max-w-md bg-lh-purple/5 border border-lh-purple/10 rounded-2xl p-6 flex items-center gap-6 cursor-pointer hover:bg-lh-purple/10 transition-all group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                                            <Clock size={64} className="text-lh-purple" />
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-lh-purple flex items-center justify-center shrink-0 shadow-2xl shadow-lh-purple/40 group-hover:rotate-12 transition-transform">
                                            <Sunrise size={20} className="text-white" />
                                        </div>
                                        <div className="space-y-1 relative z-10">
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Selected window:</p>
                                            <h3 className="text-2xl font-black text-white tracking-tighter">
                                                {selectedTimeSlot || '06:15'}
                                                <span className="text-xs text-lh-purple ml-2 opacity-70 underline underline-offset-4 decoration-lh-purple/30">UTC_SESSION</span>
                                            </h3>
                                        </div>
                                        <div className="ml-auto text-lh-purple opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setShowTimeModal(true)}
                                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all font-mono"
                                        >
                                            EXPLORE_NODES
                                        </button>
                                        <button
                                            onClick={handleBookAppointment}
                                            className="px-8 py-3 bg-lh-purple text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-lh-purple/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-3 font-mono"
                                        >
                                            RESERVE_SLOT <ArrowRight size={14} className="animate-bounce-x" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </PrecisionPanel>
            </div>

            {/* Time Selector Modal */}
            <AnimatePresence>
                {showTimeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            onClick={() => setShowTimeModal(false)}
                        ></motion.div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-full max-w-xl shadow-[0_0_100px_rgba(188,19,254,0.15)] overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 bg-lh-purple/5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Session_Relays</h3>
                                    <p className="text-[9px] font-black text-lh-purple uppercase tracking-[0.3em]">Select an operational window</p>
                                </div>
                                <button onClick={() => setShowTimeModal(false)} className="p-2 text-gray-600 hover:text-white transition-colors"><XCircle size={24} /></button>
                            </div>
                            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
                                {timeGroups.map(group => (
                                    <div key={group.id} className="group/item">
                                        <button
                                            onClick={() => group.available > 0 && setExpandedGroup(group.id)}
                                            className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between ${expandedGroup === group.id ? 'bg-lh-purple/10 border-lh-purple/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${group.color} shadow-lg`}>
                                                    <group.icon size={18} className="text-white" />
                                                </div>
                                                <div className="text-left space-y-0.5">
                                                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{group.label}</h4>
                                                    <p className={`text-[8px] font-bold uppercase tracking-[0.2em] ${group.available > 0 ? 'text-green-500' : 'text-gray-800'}`}>
                                                        {group.available > 0 ? `${group.available} slots detected` : 'Uplink unavailable'}
                                                    </p>
                                                </div>
                                            </div>
                                            {group.available > 0 && <ChevronDown size={16} className={`text-lh-purple transition-transform duration-500 ${expandedGroup === group.id ? 'rotate-180' : ''}`} />}
                                        </button>
                                        <AnimatePresence>
                                            {expandedGroup === group.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-lh-purple/[0.02] border-x border-b border-lh-purple/10 rounded-b-2xl -mt-2 mx-2 p-4 pt-6 grid grid-cols-3 gap-2"
                                                >
                                                    {group.slots.map(slot => (
                                                        <button
                                                            key={slot}
                                                            onClick={() => { setSelectedTimeSlot(slot); setShowTimeModal(false); }}
                                                            className="py-2.5 rounded-lg bg-lh-purple text-white text-[10px] font-black tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-lh-purple/20"
                                                        >
                                                            {slot}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FindAppointment;
