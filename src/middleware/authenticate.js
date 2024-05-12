import jwt from 'jsonwebtoken';

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

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }
};

export default authenticate;