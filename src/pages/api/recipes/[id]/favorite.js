/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
An API route to add and remove a recipe from the user's favorites.
*/

// Import the database connection
import dbConnect from '@/lib/mongodb';
// Import the Recipe and Favorite models
import Recipe from '@/models/Recipe';
// Import the Favorite model
import Favorite from '@/models/Favorite';
// Import the authenticate middleware
import authenticate from '@/middleware/authenticate';

/**
 * Handler for the favorite recipe request
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
  const {method} = req;
  // Get the recipe ID from the query parameters
  const recipeId = req.query.id;

  // Handle the POST request to add or remove a recipe from the user's favorites
  if (method === 'POST') {
    try {
      // Return a 401 error if the user is not logged in
      if (!req.user) {
        return res.status(401).json({success: false, message: 'Unauthorized'});
      }
      // Find the recipe by ID
      const recipe = await Recipe.findById(recipeId);
      // Return a 404 error if the recipe is not found
      if (!recipe) {
        return res.status(404).json({success: false, message: 'Recipe not found'});
      }
      // Check if the recipe is already a favorite
      const existingFavorite = await Favorite.findOne({userID: req.user.id, recipeID: recipe._id});
      if (existingFavorite) {
        // If already a favorite, remove it by deleting the favorite record from DB
        await Favorite.deleteOne({_id: existingFavorite._id});
        // Return a success message
        res.status(200).json({success: true, message: 'Recipe removed from favorites', favorite: false});
      } else {
        // If not a favorite, add it by creating a new favorite record in DB
        const newFavorite = new Favorite({userID: req.user.id, recipeID: recipe._id});
        // Save the new favorite record to the database
        await newFavorite.save();
        // Return a success message
        res.status(201).json({success: true, message: 'Recipe added to favorites', favorite: true});
      }
    // Handle any errors that occur during the process
    } catch (error) {
      // Return an error message
      res.status(500).json({success: false, message: error.message});
    }
  // Handle the request method if it's not POST
  } else {
    // Set the allowed methods
    res.setHeader('Allow', ['POST', 'DELETE']);
    // Return a 405 error if the method is not allowed
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}