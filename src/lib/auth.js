import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';


const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password + process.env.PEPPER, salt);
};

const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password + process.env.PEPPER, hash);
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.decode(token);

        if (decoded && decoded.tokenType) {
            const secret = decoded.tokenType === 'access_token'
                ? process.env.JWT_SECRET
                : process.env.JWT_REFRESH_SECRET;

            const verified = jwt.verify(token, secret);
            return verified;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};

const decodeToken = (token) => {
    return jwt.decode(token);
};

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { 
            tokenType: "access_token", 
            user: { _id: user._id }
        },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
    );
    const refreshToken = jwt.sign(
        { 
            tokenType: "refresh_token", 
            user: { _id: user._id }
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
    );
    return { access_token: accessToken, refresh_token: refreshToken };
};

const setCookies = (res, access_token='', refresh_token='') => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'Strict',
        path: '/',
    };

    if (!access_token) {
        res.setHeader('Set-Cookie', [
            cookie.serialize('access_token', '', { ...cookieOptions, maxAge: 0 }),
            cookie.serialize('refresh_token', '', { ...cookieOptions, maxAge: 0 }),
        ]);
    } else {
        res.setHeader('Set-Cookie', [
            cookie.serialize('access_token', access_token, { ...cookieOptions, maxAge: 60 * 10 }), // 10 minutes
            cookie.serialize('refresh_token', refresh_token, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 }), // 30 days
        ]);
    }
};

export { hashPassword, verifyPassword, verifyToken, decodeToken, generateTokens, setCookies };
