/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 06/06/2024
An API route to get a list of favorite recipe IDs
*/

// Import the database connection
import dbConnect from '@/lib/mongodb';
// Import the Favorite model
import Favorite from '@/models/Favorite';
// Import the authenticate middleware
import authenticate from '@/middleware/authenticate';

/**
 * Handler for the List favorite recipes
 * @param req - The request object
 * @param res - The response object
 * @returns {Promise<*>}
 */
export default async function handler(req, res) {
  // Connect to the MongoDB database
  await dbConnect();
  // Authenticate the user
  await authenticate(req, res);
  // Serve GET request to fetch a list of favorite recipes
  if (req.method === 'GET') {
    try {
      // Get the user ID if the user is logged in
      const userId = req.user ? req.user.id : null;
      // Check if the user is logged in
      if (!userId) {
        // Return a 401 error if the user is not logged in
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // Fetch the user's favorite recipes from the database
      const favoriteRecipes = await Favorite.find({ userID: userId }).select('recipeID');

      // Get the recipe IDs from the favorite recipes
      const recipeIds = favoriteRecipes.map(fav => fav.recipeID);

      // Return the favorite recipe IDs
      res.status(200).json({
        success: true, // Indicate success
        data: recipeIds, // Send the favorite recipe IDs
      });
    // Catch any errors and return an error response
    } catch (error) {
      // Send an error response
      res.status(500).json({ success: false, message: error.message });
    }
  // Handle other request methods
  } else {
    // Set the allowed methods
    res.setHeader('Allow', ['GET']);
    // Return a 405 error
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
