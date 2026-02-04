import React from 'react';
import { Shield, ChevronRight, ChevronLeft, ShoppingCart, Activity, LayoutDashboard, FileText, Globe2, LogOut } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Dashboard = () => {
    const { logout, user } = useAuth();
    const { toggleCart, cartCount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

    const menuItems = [
        { icon: <LayoutDashboard size={18} />, label: 'Overview', path: '/dashboard' },
        { icon: <Activity size={18} />, label: 'Certifications', path: '/certifications' },
        { icon: <FileText size={18} />, label: 'My Exams', path: '/dashboard/exam' },
    ];

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen h-screen bg-lh-dark text-white font-plus-jakarta flex overflow-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-lh-purple/10 blur-[100px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[25%] h-[25%] bg-lh-purple/5 blur-[80px] rounded-full"></div>
            </div>

            {/* Sidebar */}
            <aside
                className={`relative z-20 bg-[#0a0a0a]/80 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 ease-in-out flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
            >
                {/* Logo Section */}
                <div className="p-6 flex items-center justify-between">
                    {!isSidebarCollapsed && (
                        <Link to="/" className="text-xl font-black tracking-tighter cursor-pointer text-white">
                            CS<span className="text-lh-purple italic">CA</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-1.5 hover:bg-lh-purple/10 rounded-lg transition-colors text-gray-400 hover:text-white"
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
                                ? 'bg-lh-purple text-white shadow-[0_0_20px_rgba(188,19,254,0.3)]'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className={`${isActive(item.path) ? 'text-white' : 'text-lh-purple group-hover:scale-110 transition-transform'}`}>
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
                        onClick={toggleCart}
                        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-lh-purple/20 transition-all group relative"
                    >
                        <ShoppingCart size={18} className="text-lh-purple group-hover:scale-110 transition-transform" />
                        {!isSidebarCollapsed && (
                            <span className="text-[10px] font-black uppercase tracking-[0.15em]">Cart</span>
                        )}
                        {cartCount > 0 && (
                            <span className="absolute top-2.5 left-6 w-3.5 h-3.5 bg-lh-purple text-white text-[7px] font-black flex items-center justify-center rounded-full shadow-lg border border-black">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <div className="flex items-center gap-3 p-1.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lh-purple to-[#ff00ff] p-0.5 shadow-lg">
                            <div className="w-full h-full rounded-full bg-lh-dark flex items-center justify-center text-[10px] font-black uppercase italic">
                                {user?.firstName?.[0] || user?.email?.[0] || 'A'}
                            </div>
                        </div>
                        {!isSidebarCollapsed && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] font-black uppercase tracking-tight text-white truncate">{user?.firstName} {user?.lastName}</span>
                                <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest truncate">Authorized</span>
                            </div>
                        )}
                    </div>

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
                        <div className="h-3 w-[2px] bg-lh-purple"></div>
                        <h2 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Command_Center / <span className="text-white italic">{location.pathname.split('/').pop() || 'overview'}</span></h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-lh-purple uppercase tracking-widest italic animate-pulse">System_Live</span>
                            <span className="text-[10px] font-bold text-gray-500">Sector_01_Online</span>
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

export default Dashboard;
