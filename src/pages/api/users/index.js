/*
Version: 1.7
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
An API route to fetch and create users.
*/

// Import the database connection
import dbConnect from '@/lib/mongodb';
// Import the User model
import User from '@/models/User';
// Import the authenticate middleware
import authenticate from '@/middleware/authenticate';
// Import the validateUserCreation function
import { validateUserCreation } from '@/validators/UserValidators';

/**
 * Handler for the user List and Create
 * @param req - The request object
 * @param res - The response object
 * @returns {Promise<*>}
 */
export default async function handler(req, res) {
  // Connect to the MongoDB database
  await dbConnect();
  // Authenticate the user
  await authenticate(req, res);
  // Serve GET request to fetch a list of users
  if (req.method === 'GET') {
    let users;
    if (req.user.isAdmin) {
      // If the user is an admin, fetch all users
      users = await User.find({});
    } else {
      // If the user is not an admin, fetch only the user's own data
      users = await User.find({_id: req.user.userId});
    }
    // Return the list of users
    res.status(200).json({success: true, data: users});
  // Serve POST request to create a new user
  } else if (req.method === 'POST') {
    // Only allow admins to create new users
    if (!req.user.isAdmin) {
      return res.status(403).json({success: false, message: 'Unauthorized: Only admins can create users.'});
    }
    // Validate the user creation request
    await validateUserCreation(req, res, async () => {
      // Extract the user data from the request body
      const {email, password, firstName, lastName, isActive, isAdmin} = req.body;
      try {
        // Create a new user
        const newUser = new User({
          email, // Set the email
          password, // Set the password (will be hashed before saving)
          firstName, // Set the first name
          lastName, // Set the last name
          isActive, // Set the isActive
          isAdmin // Set the isAdmin
        });
        // Save the new user to the database
        await newUser.save();
        // Return the new user data
        res.status(201).json({success: true, data: newUser});
      // Handle any errors that occur during the process
      } catch (error) {
        // Return an error message
        res.status(500).json({success: false, message: error.message});
      }
    });
  // Handle the request method if it's not POST
  } else {
    // Set the allowed methods
    res.setHeader('Allow', ['GET', 'POST']);
    // Return a 405 error if the method is not allowed
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
