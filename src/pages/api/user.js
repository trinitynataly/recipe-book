import { verifyToken } from '@/lib/auth';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

export default async function handler(req, res) {
    await dbConnect();

    const { access_token: token } = req.cookies;
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    const { user: decodedUser } = decodedToken;
    const user = await User.findById(decodedUser._id);
    if (!user || !user.isActive) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    res.status(200).json({ user: { 
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin
    } });
}
