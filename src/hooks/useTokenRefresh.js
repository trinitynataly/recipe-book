import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { decodeToken } from '../lib/auth';

const refreshTokens = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        return false;
    }
    try {
        const response = await fetch('/api/renew', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: refreshToken })
        });

        if (!response.ok) {
            return false;
        }
        const data = await response.json();

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        return true;
    } catch (error) {
        return false;
    }
};

const shouldRefreshToken = (token) => {
    if (!token) return false;

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expirationTime = decoded.exp;

    // Check if the token will expire in less than 5 minutes (300 seconds)
    return expirationTime - currentTime <= 60;
};

const useTokenRefresh = () => {
    const router = useRouter();

    useEffect(() => {
        const handleTokenRefresh = async () => {
            const accessToken = localStorage.getItem('access_token');

            if (shouldRefreshToken(accessToken)) {
                const success = await refreshTokens();
                if (!success) {
                    router.push('/logout');
                }
            }
        };

        // Check if tokens are present in localStorage
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (!accessToken || !refreshToken) {
            // Do not set up the interval or refresh tokens if they are not present
            return;
        }

        // Refresh tokens immediately if needed when the page is loaded
        handleTokenRefresh();

        // Set up an interval to check and refresh tokens every minute
        const interval = setInterval(() => {
            handleTokenRefresh();
        }, 60 * 1000); // 1 minute

        return () => clearInterval(interval);
    }, [router]);
};

export default useTokenRefresh;
