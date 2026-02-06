import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                // Verify token and get fresh user data
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user) {
                        console.log("✅ Verified user from backend:", data.user);
                        setUser(data.user);
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                } else {
                    console.warn("⚠️ Token invalid or expired, logging out");
                    logout();
                }
            } catch (error) {
                console.error("❌ Error fetching user:", error);
                // Fallback to local storage if network fails? Or logout?
                // For now, keep local if network error, but log it.
            } finally {
                setLoading(false);
            }
        };

        const savedUser = localStorage.getItem('user');
        if (savedUser && token) {
            // Optimistically set user from local storage while we verify
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) { }
        }

        fetchUser();
    }, [token]);

    const login = (userData, userToken) => {
        if (!userData || !userToken) {
            console.error("Login called with missing data:", { userData, userToken });
            return;
        }
        console.log("🔐 Logging in user:", userData);
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
        console.log("✅ Auth state saved to localStorage");
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const updateUser = (userData) => {
        try {
            const savedUser = localStorage.getItem('user');
            const currentUser = (savedUser && savedUser !== 'undefined') ? JSON.parse(savedUser) : {};
            const updatedUser = { ...currentUser, ...userData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading: loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
