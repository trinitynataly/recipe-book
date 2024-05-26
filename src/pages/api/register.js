import dbConnect from '@/lib/mongodb';
import { generateTokens } from '@/lib/auth';
import User from '@/models/User';
import { validateUserRegistration } from '@/validators/UserValidators';
import { setCookies } from '@/lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    await dbConnect();

    validateUserRegistration(req, res, async () => {
        const { email, password, firstName, lastName } = req.body;
        try {
            
            const newUser = new User({
                email: email.toLowerCase(),
                password: password,
                firstName,
                lastName,
                isActive: true,
                isAdmin: false
            });

            await newUser.save();

            // Generate tokens for the new user
            const tokens = generateTokens(newUser);

            setCookies(res, tokens.access_token, tokens.refresh_token);
    
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    _id: newUser._id,
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    isAdmin: newUser.isAdmin
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });
}
