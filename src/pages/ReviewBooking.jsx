import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Menu, User, MessageSquare, LogOut, ChevronLeft, Calendar, Clock, MapPin, CreditCard, CheckCircle2, ArrowRight, Trash2, Info, Globe } from 'lucide-react';
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
            <span className="text-[9px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Reviewing Details...</span>
        </div>
    </div>
);

const ReviewBooking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        examName = "CSCA Certification Exam",
        appointmentDate,
        appointmentTime,
        confirmedTimeZone = "UTC",
        selectedLanguage = "English",
        length = "135 minutes"
    } = location.state || {};

    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsPageLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Pricing Logic
    const subtotal = 273.00;
    const taxRate = 0.18;
    const taxAmount = subtotal * taxRate;
    const totalDue = subtotal + taxAmount;

    const formatCurrency = (amount) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Tuesday, February 24, 2026";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (isPageLoading) return <GlobalPageLoader />;

    return (
        <div className="min-h-full flex flex-col relative pb-12">
            <div className="max-w-[1200px] mx-auto w-full pt-4 space-y-8">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-widest group transition-colors italic"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        back
                    </button>
                    <div className="flex items-center gap-2 text-[8px] font-black text-lh-purple uppercase tracking-widest italic animate-pulse">
                        <CheckCircle2 size={12} /> Secure_Cart_Context
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Review <span className="text-lh-purple text-transparent" style={{ WebkitTextStroke: '1px #bc13fe' }}>Booking</span></h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-8 space-y-6">
                        <PrecisionPanel className="p-0 border-white/5">
                            <div className="grid grid-cols-12 bg-white/5 border-b border-white/5 p-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                                <div className="col-span-12 md:col-span-8">Operational_Module</div>
                                <div className="col-span-6 md:col-span-2 text-right">Credit_Value</div>
                                <div className="col-span-6 md:col-span-2 text-center">Protocol</div>
                            </div>

                            <div className="p-6 md:p-8 space-y-8">
                                <div className="grid grid-cols-12 gap-6 items-start">
                                    <div className="col-span-12 md:col-span-8 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-lh-purple/10 rounded-xl">
                                                <Shield size={24} className="text-lh-purple" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black text-white italic uppercase">{examName}</h3>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Type: Professional_Certification</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                                                <div className="flex items-center gap-2 text-[8px] font-black text-lh-purple uppercase tracking-widest">
                                                    <Calendar size={12} /> Scheduling
                                                </div>
                                                <p className="text-[10px] font-black text-white uppercase italic">{formatDate(appointmentDate)}</p>
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 mt-1 uppercase italic">
                                                    <Clock size={10} /> {appointmentTime} ({confirmedTimeZone})
                                                </div>
                                            </div>
                                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                                                <div className="flex items-center gap-2 text-[8px] font-black text-lh-purple uppercase tracking-widest">
                                                    <Globe size={12} /> Parameters
                                                </div>
                                                <p className="text-[10px] font-black text-white uppercase italic">Language: {selectedLanguage}</p>
                                                <p className="text-[9px] font-bold text-gray-500 uppercase italic">Duration: {length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-6 md:col-span-2 text-right">
                                        <span className="text-2xl font-black text-white tracking-tighter italic">{formatCurrency(subtotal)}</span>
                                        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Base_Fee</p>
                                    </div>

                                    <div className="col-span-6 md:col-span-2 flex flex-col items-center gap-4">
                                        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-lh-purple hover:border-lh-purple/30 transition-all active:scale-95 group">
                                            <MapPin size={16} className="group-hover:rotate-12 transition-transform" />
                                        </button>
                                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-95">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </PrecisionPanel>

                        <div className="p-5 bg-lh-purple/5 border border-lh-purple/10 rounded-2xl flex items-center gap-4">
                            <Info size={18} className="text-lh-purple shrink-0" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed italic">
                                Final confirmation of operational window. proceed to credit authorization to finalize registration data.
                            </p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <PrecisionPanel className="p-8 border-white/5">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8 pb-4 border-b border-white/5">Order_Balance</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Subtotal</span>
                                    <span className="text-sm font-black text-white italic">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tax (v18%)</span>
                                    <span className="text-sm font-black text-white italic">{formatCurrency(taxAmount)}</span>
                                </div>
                                <div className="h-px bg-white/5 my-4"></div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-[12px] font-black text-white uppercase tracking-tighter group-hover:text-lh-purple transition-colors">Total_Due</span>
                                    <span className="text-2xl font-black text-lh-purple tracking-tighter italic glow-lh-purple">{formatCurrency(totalDue)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/payment-billing', { state: { ...location.state, subtotal, taxAmount, totalDue } })}
                                className="w-full py-4 bg-lh-purple text-white rounded-xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-lh-purple/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                AUTHORIZE_FUNDS <ArrowRight size={14} className="animate-bounce-x" />
                            </button>

                            <div className="mt-8 space-y-3 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                <div className="flex items-center gap-3 text-[8px] font-black text-gray-400 uppercase tracking-widest italic">
                                    <CreditCard size={12} className="text-lh-purple" /> Promotion Codes
                                </div>
                                <p className="text-[7px] text-gray-600 font-bold uppercase tracking-widest leading-tight italic">
                                    Codes can be applied during the primary billing verification phase.
                                </p>
                            </div>
                        </PrecisionPanel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewBooking;
