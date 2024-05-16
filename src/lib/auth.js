import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password + process.env.PEPPER, salt);
};

const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password + process.env.PEPPER, hash);
};

const verifyToken = (token) => {
    try {
        // Decode the token to read its payload and determine the token type
        const decoded = jwt.decode(token);

        if (!decoded || !decoded.tokenType) {
            throw new Error('Invalid token');
        }

        const secret = decoded.tokenType === 'access_token'
            ? process.env.JWT_SECRET
            : process.env.JWT_REFRESH_SECRET;

        // Verify the token using the appropriate secret
        const verified = jwt.verify(token, secret);
        return verified;
    } catch (err) {
        return false;
    }
};

const decodeToken = (token) => {
    return jwt.decode(token); // jwt.decode does not throw errors, so no try-catch needed
};

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { 
            tokenType: "access_token", 
            user: { 
                _id: user._id, 
                isAdmin: user.isAdmin, 
                email: user.email, 
                firstName: user.firstName, 
                lastName: user.lastName
            }
        },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
    );
    const refreshToken = jwt.sign(
        { 
            tokenType: "refresh_token", 
            user: { _id: user._id }
        },
        process.env.JWT_REFRESH_SECRET, // Use JWT_REFRESH_SECRET for refresh token
        { expiresIn: '30d' }
    );
    return { access_token: accessToken, refresh_token: refreshToken };
};

export { hashPassword, verifyPassword, verifyToken, decodeToken, generateTokens };
