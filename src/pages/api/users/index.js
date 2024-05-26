import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import authenticate from '@/middleware/authenticate';
import { validateUserCreation } from '@/validators/UserValidators';

export default async function handler(req, res) {
    await dbConnect();

    // Apply authentication middleware to all requests
    authenticate(req, res, async () => {
        if (req.method === 'GET') {
            // Fetch all users if admin, else fetch only the current user
            let users;
            if (req.user.isAdmin) {
                users = await User.find({});
            } else {
                users = await User.find({ _id: req.user.userId });
            }
            res.status(200).json({ success: true, data: users });
        } else if (req.method === 'POST') {
            // Only allow admins to create new users
            if (!req.user.isAdmin) {
                return res.status(403).json({ success: false, message: 'Unauthorized: Only admins can create users.' });
            }
            
            validateUserCreation(req, res, async () => {
                const { email, password, firstName, lastName, isActive, isAdmin } = req.body;
                try {
                    const newUser = new User({
                        email,
                        password, // Ensure you hash the password before saving
                        firstName,
                        lastName,
                        isActive,
                        isAdmin
                    });
                    await newUser.save();
                    res.status(201).json({ success: true, data: newUser });
                } catch (error) {
                    res.status(500).json({ success: false, message: error.message });
                }
            });
        } else {
            // Method not allowed
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
