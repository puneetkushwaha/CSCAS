import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("🔍 AuthContext: Loading user from localStorage");
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        console.log("🔍 Saved user:", savedUser);
        console.log("🔍 Saved token:", savedToken ? "exists" : "missing");

        if (savedUser && savedUser !== 'undefined' && token) {
            try {
                const parsedUser = JSON.parse(savedUser);
                console.log("✅ User loaded from localStorage:", parsedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("❌ Error parsing user from localStorage:", error);
                localStorage.removeItem('user');
            }
        } else {
            console.log("⚠️ No valid user in localStorage");
        }
        setLoading(false);
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
