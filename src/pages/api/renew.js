import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import { verifyToken, generateTokens } from '../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    await dbConnect();
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
        return res.status(403).json({ message: 'Invalid token' });
    }
    const { user: decodedUser, tokenType } = decodedToken;
    if (!decodedUser || tokenType != 'refresh_token') {
        return res.status(403).json({ message: 'Invalid token' });
    }
    const user = await User.findById(decodedUser._id);
    if (!user || !user.isActive) {
        return res.status(403).json({ message: 'Invalid token' });
    }
    return res.status(200).json(generateTokens(user));
}
