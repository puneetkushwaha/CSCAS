import React, { useState } from 'react';
import { LayoutDashboard, Users, FileText, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const menuItems = [
        { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: <FileText size={18} />, label: 'Exam Control', path: '/admin/exams' },
        { icon: <Users size={18} />, label: 'User Management', path: '/admin/users' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen h-screen bg-lh-dark text-white font-plus-jakarta flex overflow-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-red-600/10 blur-[100px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[25%] h-[25%] bg-blue-600/5 blur-[80px] rounded-full"></div>
            </div>

            {/* Sidebar */}
            <aside className={`relative z-20 bg-[#0a0a0a]/80 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 ease-in-out flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                {/* Logo Section */}
                <div className="p-6 flex items-center justify-between">
                    {!isSidebarCollapsed && (
                        <Link to="/admin/dashboard" className="text-xl font-black tracking-tighter cursor-pointer text-white">
                            ADMIN<span className="text-red-500 italic">PANEL</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Nav Menu */}
                <nav className="flex-1 px-3 space-y-1 mt-6 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 group relative ${isActive(item.path)
                                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className={`${isActive(item.path) ? 'text-white' : 'text-red-500 group-hover:scale-110 transition-transform'}`}>
                                {item.icon}
                            </span>
                            {!isSidebarCollapsed && (
                                <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${isActive(item.path) ? 'block' : 'opacity-70 group-hover:opacity-100'}`}>
                                    {item.label}
                                </span>
                            )}
                            {isActive(item.path) && !isSidebarCollapsed && (
                                <motion.div
                                    layoutId="active-indicator"
                                    className="absolute right-3 w-1 h-1 bg-white rounded-full"
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Profile/Actions */}
                <div className="p-3 space-y-3 border-t border-white/5 bg-black/20">
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all group"
                    >
                        <LogOut size={18} />
                        {!isSidebarCollapsed && (
                            <span className="text-[10px] font-black uppercase tracking-[0.15em]">Logout</span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                <header className="h-16 px-8 flex items-center justify-between border-b border-white/5 bg-[#0a0a0a]/40 backdrop-blur-xl z-20">
                    <div className="flex items-center gap-4">
                        <div className="h-3 w-[2px] bg-red-500"></div>
                        <h2 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">ADMINISTRATION / <span className="text-white italic">{location.pathname.split('/').pop() || 'dashboard'}</span></h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-red-500 uppercase tracking-widest italic animate-pulse">ADMIN_ACCESS</span>
                            <span className="text-[10px] font-bold text-gray-500">{user?.firstName} {user?.lastName}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 relative overflow-y-auto custom-scrollbar z-10 p-8">
                    <div className="max-w-[1400px] mx-auto min-h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
