/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
An API route to get the user's favorite recipes with pagination.
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
    // Fetch all favorite recipes
    try {
      // Get the user ID if the user is logged in
      const userId = req.user ? req.user.id : null;
      // Check if the user is logged in
      if (!userId) {
        // Return a 401 error if the user is not logged in
        return res.status(401).json({success: false, message: 'Unauthorized'});
      }
      // Get the page and per_page query parameters
      const {page = 1, per_page = 12} = req.query;
      // Get the page value as an integer
      const pageInt = parseInt(page, 10);
      // Get the value of how many recipes to show per page as an integer
      const perPageInt = parseInt(per_page, 10);
      // Calculate how many recipes to skip based on the page number
      const skip = (pageInt - 1) * perPageInt;

      // Fetch the user's favorite recipes from the database
      const favoriteRecipes = await Favorite.find({userID: userId})
        // Populate the recipe data and its tags field
        .populate({
          path: 'recipeID',
          populate: {path: 'tags'}
        });

      // Filter out favorite records that do not have corresponding recipe records
      const validFavoriteRecipes = favoriteRecipes.filter(fav => fav.recipeID);

      // Calculate the total number of favorite recipes and the total number of pages
      const totalFavorites = validFavoriteRecipes.length;
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalFavorites / perPageInt);

      // Paginate the valid favorite recipes
      const paginatedFavorites = validFavoriteRecipes.slice(skip, skip + perPageInt);
      // Get the recipe IDs from the paginated favorite recipes
      const recipes = paginatedFavorites.map(fav => fav.recipeID);
      // Convert the recipes to plain objects and add the favorite field
      const recipesWithFavorite = recipes.map(recipe => {
        // Convert the recipe to a plain object
        const recipeObject = recipe.toObject();
        // Set the favorite field to true
        recipeObject.favorite = true;
        // Return the recipe object
        return recipeObject;
      });

      // Return the favorite recipes, total number of favorite recipes, total number of pages, current page, and favorite recipes per page
      res.status(200).json({
        success: true, // Indicate success
        data: recipesWithFavorite, // Send the favorite recipes
        pagination: { // Send pagination data
          totalRecipes: totalFavorites, // Total number of favorite recipes
          totalPages, // Total number of pages
          currentPage: pageInt, // Current page
          perPage: perPageInt, // Favorite recipes per page
        },
      });
    // Catch any errors and return an error response
    } catch (error) {
      // Send an error response
      res.status(500).json({success: false, message: error.message});
    }
  // Handle other request methods
  } else {
    // Set the allowed methods
    res.setHeader('Allow', ['GET']);
    // Return a 405 error
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
