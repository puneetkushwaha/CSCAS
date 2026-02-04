import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, KeyRound, Settings, UserCircle2, Mail, Award, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import GeometricBackground from "../components/GeometricBackground.jsx";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext";
import api from '../utils/api';
import ngdPic from '../assets/images/ngd-pic.png';

const Profile = () => {
    const { user, updateUser, token } = useAuth();
    const navigate = useNavigate();

    const [profileData, setProfileData] = React.useState({
        firstName: '',
        lastName: '',
        displayName: ''
    });

    const [passwordData, setPasswordData] = React.useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || user.displayName?.split(' ')[0] || '',
                lastName: user.lastName || user.displayName?.split(' ')[1] || '',
                displayName: user.displayName || ''
            });
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            const res = await api.patch('/auth/profile', {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                displayName: `${profileData.firstName} ${profileData.lastName}`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updateUser(res.data.user);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Profile Update Error:", error);
            alert(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setIsUpdatingPassword(true);
        try {
            await api.patch('/auth/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Password updated successfully!");
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error("Password Update Error:", error);
            alert(error.response?.data?.message || "Failed to update password");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    if (!user) return null;

    return (
        <div className="relative min-h-screen bg-[#0a0a0a] text-white font-plus-jakarta flex flex-col pt-20">
            <Navbar />

            {/* Background with higher opacity for particles */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <GeometricBackground color="#bc13fe" />
            </div>

            {/* Main Profile Section */}
            <main className="relative z-10 max-w-6xl mx-auto py-12 px-6 flex-1 w-full">
                {/* Breadcrumb / Back */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link to="/" className="inline-flex items-center gap-2 text-lh-purple text-[10px] font-black uppercase tracking-widest hover:text-white transition-all group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Home
                    </Link>
                </motion.div>

                {/* User Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-12 mb-10 overflow-hidden relative group"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-lh-purple/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-lh-purple bg-black/40 shadow-2xl shadow-lh-purple/20">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt={user.displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-black bg-gradient-to-tr from-lh-purple/40 to-black">
                                            {user.displayName?.[0] || user.email[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-lh-purple rounded-2xl flex items-center justify-center border-4 border-[#0a0a0a] text-white shadow-xl">
                                    <ShieldCheck size={20} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                                        {user.displayName || (user.firstName ? `${user.firstName} ${user.lastName}` : 'Agent')}
                                    </h1>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                    <p className="text-lh-purple text-xs font-black tracking-widest uppercase bg-lh-purple/10 px-4 py-1.5 rounded-full border border-lh-purple/20">
                                        {user.role || 'Operative'}
                                    </p>
                                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                        <Mail size={14} className="text-lh-purple" /> {user.email}
                                    </p>
                                </div>
                                <p className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Verified Cyber Specialist
                                </p>
                            </div>
                        </div>

                        {/* Academy Rank Stats Card */}
                        <div className="bg-black/60 border border-white/10 rounded-3xl p-8 min-w-[240px] relative overflow-hidden text-center md:text-left shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Award size={64} className="text-white" />
                            </div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black mb-2">CSCA Registry Rank</p>
                            <p className="text-5xl font-black text-white tracking-tighter">#1,248</p>
                            <div className="mt-3 inline-block px-3 py-1 bg-lh-purple/20 rounded-lg">
                                <p className="text-[10px] text-lh-purple font-black">TOP 5% IN GLOBAL CELL</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Settings Sections */}
                    <div className="lg:col-span-12 space-y-10">
                        {/* Profile Settings */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 opacity-5">
                                <Settings size={200} className="text-white" />
                            </div>

                            <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest border-b border-white/5 pb-4">
                                <Settings className="w-6 h-6 text-lh-purple" />
                                Profile <span className="text-lh-purple">Configuration</span>
                            </h2>

                            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Assigned First Name</label>
                                    <input
                                        type="text"
                                        value={profileData.firstName}
                                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                        className="w-full p-5 bg-black/40 border border-white/5 rounded-2xl text-[11px] font-black tracking-widest text-white/80 outline-none focus:border-lh-purple/30 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Assigned Last Name</label>
                                    <input
                                        type="text"
                                        value={profileData.lastName}
                                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                        className="w-full p-5 bg-black/40 border border-white/5 rounded-2xl text-[11px] font-black tracking-widest text-white/80 outline-none focus:border-lh-purple/30 transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Registry Email (Immutable)</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-lh-purple opacity-40" size={18} />
                                        <input
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className="w-full p-5 pl-14 bg-black/40 border border-white/5 rounded-2xl text-[11px] font-black tracking-widest text-white/40 outline-none cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isUpdatingProfile}
                                    className="mt-4 px-10 py-5 bg-lh-purple text-white hover:bg-white hover:text-black transition-all duration-300 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(188,19,254,0.3)] w-fit flex items-center gap-2"
                                >
                                    {isUpdatingProfile ? "Updating..." : "Update Intelligence Registry"}
                                </button>
                            </form>
                        </motion.section>

                        {/* Access Control */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 opacity-5">
                                <Lock size={200} className="text-white" />
                            </div>

                            <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest border-b border-white/5 pb-4">
                                <Lock className="w-6 h-6 text-lh-purple" />
                                Access <span className="text-lh-purple">Control</span>
                            </h2>

                            <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Current Hash</label>
                                    <input
                                        type="password"
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full p-5 bg-black/40 border border-white/5 rounded-2xl text-[11px] font-black tracking-widest text-white/80 outline-none focus:border-lh-purple/30 transition-all placeholder:text-gray-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">New Sequence</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="NEW PASSWORD"
                                        className="w-full p-5 bg-black/40 border border-white/5 rounded-2xl text-[11px] font-black tracking-widest text-white/80 outline-none focus:border-lh-purple/30 transition-all placeholder:text-gray-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Confirm Sequence</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="REPEAT PASSWORD"
                                        className="w-full p-5 bg-black/40 border border-white/5 rounded-2xl text-[11px] font-black tracking-widest text-white/80 outline-none focus:border-lh-purple/30 transition-all placeholder:text-gray-700"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isUpdatingPassword}
                                    className="mt-4 px-10 py-5 bg-lh-purple text-white hover:bg-white hover:text-black transition-all duration-300 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(188,19,254,0.3)] md:col-span-3 w-fit flex items-center gap-2"
                                >
                                    {isUpdatingPassword ? "Updating..." : "Update Crypto-Credentials"}
                                </button>
                            </form>
                        </motion.section>

                        {/* Account Protection with Mascot */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-lh-purple/[0.03] border border-lh-purple/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden group"
                        >
                            <div className="grid md:grid-cols-2 items-center gap-12">
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-[0.2em]">
                                        <KeyRound className="w-8 h-8 text-lh-purple" /> Account Protection
                                    </h2>
                                    <p className="text-gray-400 text-[11px] font-bold uppercase leading-relaxed tracking-wider">
                                        Your account is currently protected by <span className="text-lh-purple underline decoration-lh-purple/30 underline-offset-4">CSCA Multi-Layer Intelligence Security</span>.
                                        Node synchronization is active across all authorized terminals.
                                    </p>
                                    <div className="flex gap-4">
                                        <button className="px-8 py-4 bg-lh-purple text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-lh-purple/20">
                                            View Active Nodes
                                        </button>
                                        <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 transition-all">
                                            Deactivate Node
                                        </button>
                                    </div>
                                </div>

                                <div className="relative flex justify-center order-first md:order-last">
                                    <div className="absolute inset-0 bg-lh-purple/15 blur-[80px] rounded-full scale-75 animate-pulse"></div>
                                    <motion.img
                                        src={ngdPic}
                                        alt="Mascot"
                                        className="w-full max-w-[220px] h-auto drop-shadow-[0_0_30px_rgba(188,19,254,0.4)] relative z-10"
                                        animate={{ y: [0, -15, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                    <div className="absolute -bottom-4 bg-lh-purple/40 w-24 h-4 blur-xl rounded-full"></div>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
