/*
Version: 1.6
Last edited by: Natalia Pakhomova
Last edit date: 29/05/2024
A set of helper functions for hashing and verifying passwords, generating and verifying JWT tokens.
*/

// Import the JWT library for token generation and verification
import jwt from 'jsonwebtoken';
// Import the Bcrypt library for password hashing and verification
import bcrypt from 'bcryptjs';

// Hash the user password using Bcrypt
const hashPassword = async (password) => {
    // Generate a salt for the password hash
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt and pepper
    return await bcrypt.hash(password + process.env.PEPPER, salt);
};

// Verify the user password against the stored hash
const verifyPassword = async (password, hash) => {
    // Compare the password with the hash and pepper
    return await bcrypt.compare(password + process.env.PEPPER, hash);
};

// Verify the JWT token and return the decoded payload
const verifyToken = (token) => {
    // Attempt to decode and verify the token
    try {
        // Decode the token to extract the token type
        const decoded = jwt.decode(token);
        // Check the token type and verify the token with the appropriate secret
        if (decoded && decoded.tokenType) {
            // Select the secret based on the token type
            const secret = decoded.tokenType === 'access_token'
                ? process.env.JWT_SECRET // Access token secret
                : process.env.JWT_REFRESH_SECRET; // Refresh token secret
            // Verify the token with the secret
            const verified = jwt.verify(token, secret);
            // Return the verified payload
            return verified;
        } else {
            // Return false if the token type is missing
            return false;
        }
    } catch (err) {
        // Return false if the token is invalid or expired
        return false;
    }
};

// Decode the JWT token and return the payload without verification
const decodeToken = (token) => {
    // Decode the token and return the payload
    return jwt.decode(token);
};

// Generate JWT access and refresh tokens for the user
const generateTokens = (user) => {
    // Generate an access token with a short expiry time
    const accessToken = jwt.sign(
        { 
            tokenType: "access_token", // Token type
            user: { _id: user._id } // User ID
        },
        process.env.JWT_SECRET, // Use the access token secret
        { expiresIn: '10m' } // Set the expiry time to 10 minutes
    );
    // Generate a refresh token with a long expiry time
    const refreshToken = jwt.sign(
        { 
            tokenType: "refresh_token",  // Token type
            user: { _id: user._id } // User ID
        },
        process.env.JWT_REFRESH_SECRET, // Use the refresh token secret
        { expiresIn: '30d' } // Set the expiry time to 30 days
    );
    // Return the generated tokens
    return { access_token: accessToken, refresh_token: refreshToken };
};

// Export the helper functions for password hashing and token management
export { hashPassword, verifyPassword, verifyToken, decodeToken, generateTokens };
