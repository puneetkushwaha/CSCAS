import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
    }

    if (user && user.role === 'admin') {
        return <Outlet />;
    } else {
        return <Navigate to="/" replace />;
    }
};

export default AdminRoute;
