import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';

import {
    Eye,
    EyeOff,
    Lock,
    User,
    Mail,
    Shield,
    Save,
    Loader2,
    Camera,
    ArrowLeft,
} from 'lucide-react';

const Profile = () => {
    const { user, token, updateUser } = useAuth();
    const fileInputRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    const [profile, setProfile] = useState({
        firstName: user?.firstName || user?.email || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        role: user?.role || 'student',
    });

    useEffect(() => {
        if (user) {
            setProfile({
                firstName: user?.firstName || user?.email || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                role: user?.role || 'student',
            });
        }
    }, [user]);

    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api.put('/users/update', {
                firstName: profile.firstName,
                lastName: profile.lastName,
            });

            updateUser({
                firstName: profile.firstName,
                lastName: profile.lastName,
            });

            alert('Profile updated successfully');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Server error');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setIsPasswordLoading(true);

        try {
            const res = await api.put('/users/change-password', {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
            });

            alert('Password updated successfully');
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Password update failed');
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/users/upload-image', formData);
            alert('Profile image uploaded');
            // Refresh user data if needed
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Upload failed');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen w-full bg-lh-dark text-white font-plus-jakarta flex flex-col">
            <Navbar />

            <div className="flex-1 py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Shield className="text-lh-purple" size={40} />
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-[900] uppercase tracking-tighter">
                                        User <span className="text-lh-purple">Profile</span>
                                    </h1>
                                    <p className="text-gray-400 font-bold text-xs tracking-wide uppercase mt-2">
                                        Manage your account settings
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-8">
                            {/* Left Sidebar - Avatar & Info */}
                            <div className="lg:col-span-4 space-y-6">
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="bg-[#121212]/60 backdrop-blur-3xl border border-white/5 rounded-[32px] p-8 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-lh-purple/[0.05] via-transparent to-lh-purple/[0.02] pointer-events-none"></div>

                                    <div className="relative z-10 text-center space-y-4">
                                        <div className="relative inline-block">
                                            <div className="w-32 h-32 rounded-full bg-lh-purple/20 border-4 border-lh-purple/50 flex items-center justify-center mx-auto overflow-hidden shadow-[0_0_30px_rgba(188,19,254,0.3)]">
                                                {user?.profileImage ? (
                                                    <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-16 h-16 text-lh-purple" />
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute bottom-1 right-1 w-10 h-10 bg-lh-purple rounded-full flex items-center justify-center border-4 border-lh-dark hover:scale-110 transition-transform shadow-[0_0_20px_rgba(188,19,254,0.5)]"
                                            >
                                                <Camera className="w-5 h-5 text-white" />
                                            </button>
                                        </div>

                                        <div>
                                            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                                                {profile.firstName} {profile.lastName}
                                            </h2>
                                            <p className="text-[10px] font-bold text-lh-purple uppercase tracking-widest mt-1">
                                                {profile.role}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 space-y-3">
                                            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase">
                                                <Mail className="w-4 h-4 text-lh-purple" />
                                                {profile.email}
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase">
                                                <Shield className="w-4 h-4 text-lh-purple" />
                                                Verified Account
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Side - Forms */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Profile Update Form */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="bg-[#121212]/60 backdrop-blur-3xl border border-white/5 rounded-[32px] p-8 md:p-10 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-lh-purple/[0.05] via-transparent to-lh-purple/[0.02] pointer-events-none"></div>

                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <User className="text-lh-purple" size={28} />
                                            <h2 className="text-2xl md:text-3xl font-[900] uppercase tracking-tighter">
                                                Profile <span className="text-lh-purple">Settings</span>
                                            </h2>
                                        </div>

                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <motion.div variants={itemVariants} className="relative group/input">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={profile.firstName}
                                                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-5 text-[11px] font-black tracking-wide outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.03] transition-all"
                                                    />
                                                </motion.div>
                                                <motion.div variants={itemVariants} className="relative group/input">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={profile.lastName}
                                                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-5 text-[11px] font-black tracking-wide outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.03] transition-all"
                                                    />
                                                </motion.div>
                                            </div>

                                            <motion.div variants={itemVariants} className="relative group/input">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                                                    Email Address (Read Only)
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    readOnly
                                                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-5 text-[11px] font-black tracking-wide outline-none cursor-not-allowed text-gray-600"
                                                />
                                            </motion.div>

                                            <motion.button
                                                variants={itemVariants}
                                                type="submit"
                                                disabled={isLoading}
                                                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(188, 19, 254, 0.4)" }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-lh-purple text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all relative overflow-hidden group/btn flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Save className="w-5 h-5" />
                                                        <span>Update Profile</span>
                                                    </>
                                                )}
                                                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                                            </motion.button>
                                        </form>
                                    </div>
                                </motion.div>

                                {/* Password Change Form */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="bg-[#121212]/60 backdrop-blur-3xl border border-white/5 rounded-[32px] p-8 md:p-10 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-lh-purple/[0.05] via-transparent to-lh-purple/[0.02] pointer-events-none"></div>

                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <Lock className="text-lh-purple" size={28} />
                                            <h2 className="text-2xl md:text-3xl font-[900] uppercase tracking-tighter">
                                                Change <span className="text-lh-purple">Password</span>
                                            </h2>
                                        </div>

                                        <form onSubmit={handlePasswordChange} className="space-y-6">
                                            <motion.div variants={itemVariants} className="relative group/input">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                                                    Current Password
                                                </label>
                                                <Lock className="absolute left-5 bottom-5 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                                <input
                                                    type={showOldPassword ? "text" : "password"}
                                                    value={passwords.oldPassword}
                                                    onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                                    required
                                                    placeholder="••••••••"
                                                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-[11px] font-black tracking-wide outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.03] transition-all placeholder:text-gray-700"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                                    className="absolute right-5 bottom-5 text-gray-600 hover:text-white transition-colors"
                                                >
                                                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </motion.div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <motion.div variants={itemVariants} className="relative group/input">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                                                        New Password
                                                    </label>
                                                    <Lock className="absolute left-5 bottom-5 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        value={passwords.newPassword}
                                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                        required
                                                        placeholder="••••••••"
                                                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-[11px] font-black tracking-wide outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.03] transition-all placeholder:text-gray-700"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-5 bottom-5 text-gray-600 hover:text-white transition-colors"
                                                    >
                                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </motion.div>

                                                <motion.div variants={itemVariants} className="relative group/input">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                                                        Confirm Password
                                                    </label>
                                                    <Lock className="absolute left-5 bottom-5 text-lh-purple group-focus-within/input:scale-110 transition-transform" size={18} />
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={passwords.confirmPassword}
                                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                        required
                                                        placeholder="••••••••"
                                                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-[11px] font-black tracking-wide outline-none focus:border-lh-purple/50 focus:bg-lh-purple/[0.03] transition-all placeholder:text-gray-700"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-5 bottom-5 text-gray-600 hover:text-white transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </motion.div>
                                            </div>

                                            <motion.button
                                                variants={itemVariants}
                                                type="submit"
                                                disabled={isPasswordLoading}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full border-2 border-lh-purple text-lh-purple hover:bg-lh-purple hover:text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2"
                                            >
                                                {isPasswordLoading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Lock className="w-5 h-5" />
                                                        <span>Update Password</span>
                                                    </>
                                                )}
                                            </motion.button>
                                        </form>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
