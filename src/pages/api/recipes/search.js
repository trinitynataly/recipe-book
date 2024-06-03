/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 29/05/2024
An API route to search for recipes by keyword with pagination.
*/

// Import the database connection
import dbConnect from '@/lib/mongodb';
// Import the Recipe model
import Recipe from '@/models/Recipe';
// Imoprt the Favorite model
import Favorite from '@/models/Favorite';
// Import the authenticate middleware
import authenticate from '@/middleware/authenticate';

/**
 * Handler for the recipe search request
 * @param req - The request object
 * @param res - The response object
 * @returns {Promise<*>}
 */
export default async function handler(req, res) {
  // Connect to the database
  await dbConnect();
  // Authenticate the user
  await authenticate(req, res);
  // Check if the request method is GET
  if (req.method === 'GET') {
    try {
      // Get the keyword, page, and per_page query parameters
      const {keyword, page = 1, per_page = 12} = req.query;
      const userId = req.user ? req.user.id : null;
      // Define the search query
      const query = {
        $or: [{title: {$regex: keyword, $options: 'i'}}, // Search by title
          {description: {$regex: keyword, $options: 'i'}}, // Search by description
          {ingredients: {$regex: keyword, $options: 'i'}}, // Search by ingredients
          {instructions: {$regex: keyword, $options: 'i'}}, // Search by instructions
        ],
      };

      // Get page value as Integer
      const pageInt = parseInt(page, 10);
      // Get value of how many recipes to show per page as Integer
      const perPageInt = parseInt(per_page, 10);
      // Calculate how many recipes to skip based on the page number
      const skip = (pageInt - 1) * perPageInt;

      let userFavoriteRecipeIds = [];

      if (userId) {
        // Fetch the user's favorite recipes if user is logged in
        const userFavorites = await Favorite.find({userID: userId}).select('recipeID');
        userFavoriteRecipeIds = userFavorites.map(fav => fav.recipeID.toString());
      }

      // Find recipes that match the search query
      const recipes = await Recipe.find(query)
        .populate('tags') // Populate the tags field
        .skip(skip) // Skip recipes based on the page number
        .limit(perPageInt); // Limit the number of recipes per page

      const recipesWithFavorite = recipes.map(recipe => {
        const recipeObject = recipe.toObject();
        if (userId) {
          recipeObject.favorite = userFavoriteRecipeIds.includes(recipeObject._id.toString());
        } else {
          recipeObject.favorite = false;  // No favorite field if no user
        }
        return recipeObject;
      });

      // Get the total number of recipes that match the search query
      const totalRecipes = await Recipe.countDocuments(query);
      // Calculate the total number of pages based on the total number of recipes and recipes per page
      const totalPages = Math.ceil(totalRecipes / perPageInt);

      // Return the recipes, total number of recipes, total number of pages, current page, and recipes per page
      res.status(200).json({
        success: true, // Return success as true
        data: recipesWithFavorite, // Return the recipes
        pagination: { // Return the pagination data
          totalRecipes, // Return the total number of recipes
          totalPages, // Return the total number of pages
          currentPage: pageInt, // Return the current page
          perPage: perPageInt, // Return the recipes per page
        },
      });
      // Catch any errors and return an error response
    } catch (error) {
      // Return an error response if there is an error
      res.status(500).json({success: false, message: error.message});
    }
  // Handle other request methods
  } else {
    // Return an error response if the request method is not GET
    res.setHeader('Allow', ['GET']);
    // Return a 405 Method Not Allowed status code
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
