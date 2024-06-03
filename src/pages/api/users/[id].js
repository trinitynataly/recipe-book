/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
An API route to fetch, update, and delete a user by ID.
*/

// Import the database connection
import dbConnect from '@/lib/mongodb';
// Import the User model
import User from '@/models/User';
// Import the authenticate middleware
import authenticate from '@/middleware/authenticate';
// Import the validateUserUpdate function
import { validateUserUpdate } from '@/validators/UserValidators';

/**
 * Handler for the user by ID requests
 * @param req - The request object
 * @param res - The response object
 * @returns {Promise<*>}
 */
export default async function handler(req, res) {
    // Connect to the MongoDB database
    await dbConnect();
    // Authenticate the user
    await authenticate(req, res);
    // Get the request method
    const { method } = req;
    // Get the user ID from the query parameters
    const userId = req.query.id;

    // Handle the request method
    switch (method) {
        // Handle the GET request to fetch a user by ID
        case 'GET':
            // Fetch a user, admin can fetch any, user only their own
            if (req.user.isAdmin || req.user.userId === userId) {
                // Find the user by ID
                const user = await User.findById(userId);
                // Return a 404 error if the user is not found
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }
                // Return the user data
                res.status(200).json({ success: true, data: user });
            } else {
                // Return a 403 error if the user is not authorized
                res.status(403).json({ success: false, message: 'Not authorized' });
            }
            break;
        // Handle the PUT request to update a user by ID
        case 'PUT':
            // Validate the user update request
            await validateUserUpdate(req, res, async () => {
                // Extract the user data from the request body
                const { email, firstName, lastName, isActive, isAdmin } = req.body;
                // Return a 403 error if the user is not authorized to update the user
                if (!req.user.isAdmin && req.user.userId !== userId) {
                    return res.status(403).json({ success: false, message: 'Not authorized' });
                }
                // Update the user by ID
                const user = await User.findByIdAndUpdate(userId, { email, firstName, lastName, isActive, isAdmin }, { new: true });
                // Return a 404 error if the user is not found
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }
                // Return the updated user data
                res.status(200).json({ success: true, data: user });
            });
            break;
        // Handle the DELETE request to delete a user by ID
        case 'DELETE':
            // Only allow admins to delete users
            if (req.user.isAdmin) {
                // Delete the user by ID
                const user = await User.findByIdAndDelete(userId);
                // Return a 404 error if the user is not found
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }
                // Return a success message
                res.status(200).json({ success: true, message: 'User deleted' });
            } else {
                // Return a 403 error if the user is not authorized to delete users
                res.status(403).json({ success: false, message: 'Not authorized to delete users' });
            }
            break;
        // Handle the request method if it's not GET, PUT, or DELETE
        default:
            // Set the allowed methods
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            // Return a 405 error if the method is not allowed
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
