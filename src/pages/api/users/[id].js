import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import authenticate from '@/middleware/authenticate';
import { validateUserUpdate } from '@/validators/UserValidators';

export default async function handler(req, res) {
    await dbConnect();
    const { method } = req;
    const userId = req.query.id;

    // Authenticate and decode token
    authenticate(req, res, async () => {
        switch (method) {
            case 'GET':
                // Fetch a user, admin can fetch any, user only their own
                if (req.user.isAdmin || req.user.userId === userId) {
                    const user = await User.findById(userId);
                    if (!user) {
                        return res.status(404).json({ success: false, message: 'User not found' });
                    }
                    res.status(200).json({ success: true, data: user });
                } else {
                    res.status(403).json({ success: false, message: 'Not authorized' });
                }
                break;
            case 'PUT':
                // Update a user, admin can update any, user only their own
                validateUserUpdate(req, res, async () => {
                    const { email, firstName, lastName, isActive, isAdmin } = req.body;
                    if (!req.user.isAdmin && req.user.userId !== userId) {
                        return res.status(403).json({ success: false, message: 'Not authorized' });
                    }
                    const user = await User.findByIdAndUpdate(userId, { email, firstName, lastName, isActive, isAdmin }, { new: true });
                    if (!user) {
                        return res.status(404).json({ success: false, message: 'User not found' });
                    }
                    res.status(200).json({ success: true, data: user });
                });
                break;
            case 'DELETE':
                // Delete a user, admin can delete any, user cannot delete at all
                if (req.user.isAdmin) {
                    const user = await User.findByIdAndDelete(userId);
                    if (!user) {
                        return res.status(404).json({ success: false, message: 'User not found' });
                    }
                    res.status(200).json({ success: true, message: 'User deleted' });
                } else {
                    res.status(403).json({ success: false, message: 'Not authorized to delete users' });
                }
                break;
            default:
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    });
}
