import { verifyToken } from '@/lib/auth';
import cookie from 'cookie';

const authenticate = (req, res, next) => {
    const cookies = req.headers.cookie;
    let token = null;

    if (cookies) {
        const parsedCookies = cookie.parse(cookies);
        token = parsedCookies.access_token;
    }

    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }

    if (token) {
        const decodedToken = verifyToken(token);
        if (decodedToken) {
            const { user: decodedUser, tokenType } = decodedToken;
            if (decodedUser && tokenType === 'access_token') {
                req.user = decodedUser;
            }
        }
    }
    next();
};

export default authenticate;
