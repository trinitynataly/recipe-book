import { useRouter } from 'next/router';
import axios from 'axios';

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
};

const useApi = () => {
    const router = useRouter();

    const apiRequest = async (endpoint, method = 'GET', data = null, forceToken = false) => {
        const token = getAuthToken();
        if (!token && !forceToken) {
            router.push('/logout');
            throw new Error('Unauthorized');
        }
        const config = {
            url: `/api/${endpoint}`,
            method,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        if (data) {
            if (method !== 'GET') {
                if (data instanceof FormData) {
                    config.headers['Content-Type'] = 'multipart/form-data';
                    config.data = data;
                } else {
                    config.headers['Content-Type'] = 'application/json';
                    config.data = JSON.stringify(data);
                }
            } else {
                config.params = data;
            }
        }

        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error(`Error during API request to ${endpoint}`, error);
            if (error.response && error.response.status === 401) {
                router.push('/logout');
            } else {
                throw error;
            }
        }
    };

    return apiRequest;
};

export default useApi;
