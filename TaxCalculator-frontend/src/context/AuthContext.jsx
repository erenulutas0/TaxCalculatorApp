import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService.js';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(authService.getCurrentUser());
    const [loading, setLoading] = useState(false);

    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp < currentTime;
        } catch (error) {
            return true;
        }
    };

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser.token) {
            if (isTokenExpired(currentUser.token)) {
                authService.logout();
                setUser(null);
            } else {
                setUser(currentUser);
            }
        }
    }, []);

    const login = async (username, password) => {
        try {
            setLoading(true);
            const userData = await authService.login(username, password);
            setUser(userData);
            return userData;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password, role) => {
        try {
            setLoading(true);
            return await authService.register(username, email, password, role);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
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