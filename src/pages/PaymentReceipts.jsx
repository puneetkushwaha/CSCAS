import React from 'react';
import { CreditCard, Receipt, ExternalLink, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/70 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const PaymentReceipts = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 pb-16 relative">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-lh-purple/5 blur-[180px] rounded-full pointer-events-none"></div>

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
                        <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.5em]">Billing_Interface</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        PROTOCOL <span className="text-transparent font-black" style={{ WebkitTextStroke: '1px #bc13fe' }}>RECEIPTS</span>
                    </h1>
                </div>

                <PrecisionPanel className="p-10">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left pb-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Transaction_ID</th>
                                    <th className="text-left pb-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Objective_Relay</th>
                                    <th className="text-left pb-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Value_Sync</th>
                                    <th className="text-left pb-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Status</th>
                                    <th className="text-right pb-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {[
                                    { id: 'TX-99021', item: 'CSCA+ Professional Certification', amount: '$349.00', status: 'VERIFIED' },
                                    { id: 'TX-98745', item: 'Registry Maintenance Unit', amount: '$120.00', status: 'VERIFIED' },
                                    { id: 'TX-98441', item: 'NetGuardian Protocol Entry', amount: '$299.00', status: 'VERIFIED' }
                                ].map((tx, i) => (
                                    <tr key={i} className="group/row hover:bg-white/[0.01] transition-colors">
                                        <td className="py-8 text-[11px] font-mono text-lh-purple font-black tracking-widest uppercase">{tx.id}</td>
                                        <td className="py-8 text-[13px] font-black text-white uppercase tracking-tighter">{tx.item}</td>
                                        <td className="py-8 text-[12px] font-black text-gray-400 font-mono tracking-widest">{tx.amount}</td>
                                        <td className="py-8">
                                            <div className="flex items-center gap-2 text-green-500">
                                                <ShieldCheck size={14} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{tx.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-8 text-right">
                                            <button className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white hover:bg-lh-purple transition-all">
                                                <Receipt size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </PrecisionPanel>
            </div>
        </div>
    );
};

export default PaymentReceipts;
