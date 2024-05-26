import { setCookies } from '@/lib/auth';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    setCookies(res);
    
    res.status(200).json({ success: true, message: 'Logged out successfully' });
}
