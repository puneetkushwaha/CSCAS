import React, { useEffect, useState } from 'react';
import { Users, FileText, Activity } from 'lucide-react';
import axios from 'axios';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-[#0a0a0a]/60 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            {icon}
        </div>
        <div className="relative z-10">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-black text-white">{value}</div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, exams: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Mock stats or fetch derived stats if endpoints exist
                // For now just fetching lists length if possible or just placeholders
                const usersRes = await axios.get('http://localhost:5000/api/users'); // Will need this endpoint
                const examsRes = await axios.get('http://localhost:5000/api/exams');

                setStats({
                    users: usersRes.data.length || 0,
                    exams: examsRes.data.length || 0
                });
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Overview</h1>
                <p className="text-gray-500 text-sm">System status and key metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.users}
                    icon={<Users size={64} />}
                    color="text-blue-500"
                />
                <StatCard
                    title="Active Exams"
                    value={stats.exams}
                    icon={<FileText size={64} />}
                    color="text-green-500"
                />
                <StatCard
                    title="System Health"
                    value="100%"
                    icon={<Activity size={64} />}
                    color="text-red-500"
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
