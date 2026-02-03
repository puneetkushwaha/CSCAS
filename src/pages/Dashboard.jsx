import React from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Settings, LogOut, LayoutDashboard, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    alert("YOU HAVE REACHED THE NEW DASHBOARD COMPONENT! Path: " + window.location.pathname);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] text-white font-plus-jakarta flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-7xl mx-auto w-full pt-24">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-lh-purple uppercase tracking-[0.3em] text-[10px] font-black">
                            <LayoutDashboard size={14} />
                            <span>System Overview</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-[900] uppercase tracking-tighter">
                            Welcome, <span className="text-lh-purple">{user?.firstName || 'User'}</span>
                        </h1>
                        <p className="text-gray-500 font-bold text-xs tracking-wide border-l-2 border-lh-purple pl-4 uppercase">
                            Your security clearance level: Elite Associate
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-2 rounded-2xl backdrop-blur-xl">
                        <button className="p-3 hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-white relative">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-lh-purple rounded-full border-2 border-[#0a0a0a]"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-white/5"></div>
                        <div className="flex items-center gap-3 pl-2 pr-4">
                            <div className="w-10 h-10 rounded-xl bg-lh-purple/20 border border-lh-purple/30 flex items-center justify-center text-lh-purple font-black">
                                {user?.firstName?.[0] || 'U'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest">{user?.firstName} {user?.lastName}</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Stats Card 1 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-lh-purple/30 transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield size={80} className="text-lh-purple" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-lh-purple/10 border border-lh-purple/20 flex items-center justify-center text-lh-purple">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Protection Status</h3>
                                <p className="text-2xl font-black uppercase tracking-tight">Active & Secure</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Card 2 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-lh-purple/30 transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <User size={80} className="text-lh-purple" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-lh-purple/10 border border-lh-purple/20 flex items-center justify-center text-lh-purple">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Profile Integrity</h3>
                                <p className="text-2xl font-black uppercase tracking-tight">Verified Elite</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 flex flex-col justify-between hover:border-lh-purple/30 transition-all duration-500"
                    >
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-lh-purple">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex flex-col items-center gap-2 p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-lh-purple/10 hover:border-lh-purple/20 transition-all group">
                                    <Settings size={20} className="text-gray-400 group-hover:text-lh-purple transition-colors" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Settings</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex flex-col items-center gap-2 p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-red-500/10 hover:border-red-500/20 transition-all group"
                                >
                                    <LogOut size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-red-500 transition-colors">Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Area Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 flex-1 bg-white/[0.01] border border-white/5 rounded-[40px] border-dashed flex flex-col items-center justify-center p-12 text-center group"
                >
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-6 group-hover:border-lh-purple/30 transition-colors">
                        <LayoutDashboard size={40} className="text-white/10 group-hover:text-lh-purple/30 transition-colors" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-[0.2em] mb-2">Module Development in Progress</h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                        Our engineering team is currently deploying high-priority modules. Check back soon for full system access.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
