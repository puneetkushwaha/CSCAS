import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_BASE_URL;

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
} from 'lucide-react';
import RedGeometricBackground from '../components/RedGeometricBackground';

const Profile = () => {
    const { user, token, updateUser } = useAuth(); // ✅ updateUser add kiya
    const fileInputRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    const [profile, setProfile] = useState({
        firstName: user?.firstName || user?.email || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        role: user?.role || 'student',
    });

    // ✅ FIX: user update hone ke baad profile state ko sync karo
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

    // 🔹 UPDATE PROFILE
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/users/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || 'Unauthorized');
                return;
            }

            // ✅ Context ko update karo taaki UI immediately update ho jaye
            updateUser({
                firstName: profile.firstName,
                lastName: profile.lastName,
            });

            alert('Profile updated successfully');
        } catch (err) {
            console.error(err);
            alert('Server error');
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 CHANGE PASSWORD
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setIsPasswordLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/users/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || 'Password update failed');
                return;
            }

            alert('Password updated successfully');
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error(err);
            alert('Server error');
        } finally {
            setIsPasswordLoading(false);
        }
    };

    // 🔹 IMAGE UPLOAD
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${BASE_URL}/users/upload-image`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || 'Upload failed');
                return;
            }

            alert('Profile image uploaded');
        } catch (err) {
            console.error(err);
            alert('Server error');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative font-['Inter']">
            <RedGeometricBackground
                height={30}
                jaggednessScale={2}
                opacity={0.3}
                planeSize={[60, 40]}
                cameraPos={[0, 0, 15]}
                ashCount={150}
            />

            <div className="relative z-10 max-w-4xl mx-auto pt-32 pb-20 px-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Left Side - Avatar & Quick Info */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center relative overflow-hidden group">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-900 via-red-600 to-red-900"></div>

                            <div className="relative inline-block mb-4">
                                <div className="w-24 h-24 rounded-full bg-red-600/20 border-2 border-red-600/50 flex items-center justify-center mx-auto overflow-hidden">
                                    {user?.profileImage ? (
                                        <img src={`${BASE_URL}${user.profileImage}`} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-red-500" />
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
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-black hover:scale-110 transition-transform"
                                >
                                    <Camera className="w-4 h-4 text-white" />
                                </button>
                            </div>

                            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-1">
                                {profile.firstName} {profile.lastName}
                            </h2>
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-4">{profile.role}</p>

                            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                                    <Mail className="w-3 h-3 text-red-500" />
                                    {profile.email}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                                    <Shield className="w-3 h-3 text-red-500" />
                                    Verified Operative
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-600/5 border border-red-600/20 rounded-2xl p-6">
                            <h3 className="text-xs font-black uppercase text-red-500 mb-2 tracking-widest">Academy Rank</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-black text-white">#1,248</span>
                                <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-400">TOP 5%</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Forms */}
                    <div className="w-full md:w-2/3 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-900 via-red-600 to-red-900"></div>

                            <h1 className="text-2xl font-black text-white mb-8 uppercase tracking-wider flex items-center gap-3">
                                <div className="p-2 bg-red-600 rounded-lg">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                Profile Settings
                            </h1>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">First Name</label>
                                        <input
                                            type="text"
                                            value={profile.firstName}
                                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 focus:bg-black transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={profile.lastName}
                                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 focus:bg-black transition-all font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address (Registry)</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        readOnly
                                        className="w-full bg-white/[0.01] border border-white/5 rounded-lg px-4 py-3 text-gray-500 text-sm focus:outline-none cursor-not-allowed font-medium"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-8 rounded-xl uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-red-900/40 hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Update Registry</>}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Password Change Card */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-900 via-red-600 to-red-900"></div>

                            <h2 className="text-xl font-black text-white mb-8 uppercase tracking-wider flex items-center gap-3">
                                <div className="p-2 bg-red-600 rounded-lg">
                                    <Lock className="w-5 h-5 text-white" />
                                </div>
                                Access Control
                            </h2>

                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Current Password</label>
                                    <div className="relative group">
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            value={passwords.oldPassword}
                                            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                            required
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 focus:bg-black transition-all font-bold pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">New Hash</label>
                                        <div className="relative group">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={passwords.newPassword}
                                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                required
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 focus:bg-black transition-all font-bold pr-12"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                            >
                                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Confirm Hash</label>
                                        <input
                                            type="password"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            required
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 focus:bg-black transition-all font-bold"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isPasswordLoading}
                                        className="border-2 border-red-600 hover:bg-red-600 text-red-500 hover:text-white font-black py-4 px-8 rounded-xl uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isPasswordLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Credentials"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-red-900/5 border border-red-900/20 rounded-3xl p-8 backdrop-blur-xl">
                            <h3 className="text-sm font-black uppercase text-red-500 mb-4 tracking-widest flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Account Protection
                            </h3>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">Your account is currently protected by CSCA Multi-Layer Security. Ensure your session is terminated when accessing from untrusted terminals.</p>
                                <button className="whitespace-nowrap px-8 py-3 border-2 border-red-900/50 rounded-xl text-[10px] font-black uppercase text-red-500 hover:bg-red-900/10 transition-all tracking-[0.2em]">Deactivate Node</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
