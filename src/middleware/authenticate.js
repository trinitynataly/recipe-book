import { verifyToken } from '../lib/auth';

const authenticate = (req, res, next) => {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const parts = tokenHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ success: false, message: 'Token format invalid' });
    }

    const token = parts[1];

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    const { user: decodedUser, tokenType } = decodedToken;
    if (!decodedUser || tokenType !== 'access_token') {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = decodedUser;
    next();
};

export default authenticate;