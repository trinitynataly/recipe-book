import axios from 'axios';

export const refreshAccessToken = async () => {
    try {
        const res = await axios.post('/api/renew');
        return res.data.success;
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        return false;
    }
};
