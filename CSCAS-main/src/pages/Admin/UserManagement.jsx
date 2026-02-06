import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Shield, ShieldOff } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        if (token) fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
        }
    };

    // Function to handle role toggle would go here (requires backend update)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-2">User Management</h1>
                    <p className="text-gray-500 text-sm">Manage user roles and permissions.</p>
                </div>
            </div>

            <div className="bg-[#0a0a0a]/60 border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">User</th>
                                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Joined</th>
                                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-white">
                                            {user.firstName ? user.firstName[0] : 'U'}
                                        </div>
                                        <span className="text-sm font-bold text-white">{user.firstName} {user.lastName}</span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                            {user.role || 'User'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        {/* Action buttons */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
