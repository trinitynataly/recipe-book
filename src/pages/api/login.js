import dbConnect from '@/lib/mongodb';
import { verifyPassword, generateTokens } from '@/lib/auth';
import { validateLogin } from '@/validators/UserValidators';
import { setCookies } from '@/lib/auth';
import User from '@/models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    await dbConnect();
    validateLogin(req, res, async () => {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !user.isActive) {
            return res.status(401).json({ success: false, message: 'Sorry, this account does not exist' });
        }
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Sorry, the password is incorrect' });
        }
        
        const tokens = generateTokens(user);

        setCookies(res, tokens.access_token, tokens.refresh_token);
        
        res.status(200).json({ 
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin
            }
        });
    });
}
