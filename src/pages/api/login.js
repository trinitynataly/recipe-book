import dbConnect from '../../lib/mongodb';
import { validateLogin } from '../../validators/UserValidators';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();
    validateLogin(req, res, async () => {
        const { email, password } = req.body;
        console.log(email, password);
        const user = await User.findOne({ email });
        console.log(user);
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const isMatch = await bcrypt.compare(password + process.env.PEPPER, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    });
}
