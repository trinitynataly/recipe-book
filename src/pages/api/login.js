import dbConnect from '../../lib/mongodb';
import { validateLogin } from '../../validators/UserValidators';
import User from '../../models/User';
import { generateTokens, verifyPassword } from '../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();
    validateLogin(req, res, async () => {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        return res.status(200).json(generateTokens(user));
    });
}
