import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import { validateUserRegistration } from '../../validators/UserValidators';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    await dbConnect();

    validateUserRegistration(req, res, async () => {
        const { email, password, firstName, lastName } = req.body;
        try {
            const newUser = new User({
                email,
                password,
                firstName,
                lastName,
                isActive: true,
                isAdmin: false
            });
            await newUser.save();
            res.status(201).json({ success: true, message: 'User registered successfully', data: { id: newUser._id } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });
}
