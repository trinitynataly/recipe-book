/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 01/06/2024
API endpoint for new user registration
*/

// Import the dbConnect function from the MongoDB connection library
import dbConnect from '@/lib/mongodb';
// Import the User model
import User from '@/models/User';
// Import the validateUserRegistration function from the UserValidators file
import { validateUserRegistration } from '@/validators/UserValidators';

/**
 * Handler for the user registration request
 * @param req - The request object
 * @param res - The response object
 * @returns {Promise<*>}
 */
export default async function handler(req, res) {
  // Connect to the MongoDB database
  await dbConnect();
  // Check if the request method is POST
  if (req.method !== 'POST') {
    // Return a 405 error if the request method is not POST
    return res.status(405).end();
  }

  // Proceed with the user registration
  try {
    // Validate the user registration
    await validateUserRegistration(req, res, async () => {
      // Extract the user registration data
      const { firstName, lastName, email, password } = req.body;
      // Create a new user
      const newUser = new User({
        firstName, // User first name
        lastName, // User last name
        email: email.toLowerCase(), // User email, ensure it is stored in lowercase
        password, // User password (no need to hash it as it is hashed automatically in the User model)
      });

      // Save the new user
      await newUser.save();
      // Return a 201 response with the user data
      return res.status(201).json({ message: 'User created successfully', user: newUser });
    });
  } catch (error) { // Catch any errors
    // Return a 500 error with the error message
    return res.status(500).json({ message: error.message });
  }
}
