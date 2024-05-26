import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { refreshAccessToken } from '@/lib/refreshToken';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalId = useRef(null);  // Use useRef to keep track of the interval ID

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/user');
                setUser(res.data.user);
                setError(null);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        const initializeUser = async () => {
            setLoading(true);
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                await fetchUser();
            } else {
                setUser(null);
                setLoading(false);
            }
        };

        intervalId.current = setInterval(async () => {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                await fetchUser();
            } else {
                setUser(null);
            }
        }, 9 * 60 * 1000); // 9 minutes

        initializeUser();

        return () => clearInterval(intervalId.current);  // Clear the interval on unmount
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/login', { email, password });
            if (res.data.success) {
                setUser(res.data.user);
                setError(null);
                return true;
            } else {
                setError(res.data.error);
                return false;
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
            return false;
        }
    };

    const register = async (firstName, lastName, email, password) => {
        try {
            const res = await axios.post('/api/register', { firstName, lastName, email, password });
            if (res.data.success) {
                setUser(res.data.user);
                setError(null);
                return true;
            } else {
                setError(res.data.message);
                return false;
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
            setError(errorMessage);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
            setUser(null);
            clearInterval(intervalId.current);  // Clear the interval on logout
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, register, logout, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
