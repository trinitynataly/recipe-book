import dbConnect from '@/lib/mongodb';
import { verifyToken, generateTokens } from '@/lib/auth';
import User from '@/models/User';
import { setCookies } from '@/lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
    await dbConnect();
    
    const { refresh_token: token } = req.cookies;
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    const { user: decodedUser, tokenType } = decodedToken;
    if (!decodedUser || tokenType !== 'refresh_token') {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    const user = await User.findById(decodedUser._id);
    if (!user || !user.isActive) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    const tokens = generateTokens(user);

    setCookies(res, tokens.access_token, tokens.refresh_token);

    res.status(200).json({ success: true });
}
