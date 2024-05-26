import axios from 'axios';
import { refreshAccessToken } from './refreshToken';
import cookie from 'cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const apiRequest = async (endpoint, method = 'GET', data = null, context = null) => {
    const url = `${BASE_URL}/api/${endpoint}`;
    const headers = {};

    // Conditionally set Content-Type header
    if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const getCookies = () => {
        if (context && context.req) {
            return cookie.parse(context.req.headers.cookie || '');
        } else {
            return cookie.parse(document.cookie);
        }
    };

    const cookies = getCookies();
    if (cookies.access_token) {
        headers['Authorization'] = `Bearer ${cookies.access_token}`;
    }

    try {
        const response = await axios({
            url,
            method,
            headers,
            data,
            withCredentials: true, // include credentials to send cookies
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                // Retry the original request with new token
                const newCookies = getCookies();
                if (newCookies.access_token) {
                    headers['Authorization'] = `Bearer ${newCookies.access_token}`;
                }
                const retryResponse = await axios({
                    url,
                    method,
                    headers,
                    data,
                    withCredentials: true,
                });
                return retryResponse.data;
            } else {
                // If refreshing fails, handle accordingly (e.g., redirect to login)
                if (context && context.res) {
                    context.res.writeHead(302, { Location: '/login' });
                    context.res.end();
                } else {
                    window.location.href = '/login';
                }
                return null;
            }
        }
        throw error;
    }
};

export default apiRequest;
