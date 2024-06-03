/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
An API route to fetch, update, and delete a recipe by slug or ID.
*/

// Import the database connection
import dbConnect from '@/lib/mongodb';
// Import the Recipe, Tag, Favorite, and User models
import Recipe from '@/models/Recipe';
import Tag from '@/models/Tag';
import Favorite from '@/models/Favorite';
import User from '@/models/User';
// Import the authenticate middleware
import authenticate from '@/middleware/authenticate';
// Import the validateRecipeUpdate function
import {validateRecipeUpdate} from '@/validators/RecipeValidators';

/**
 * Handler for the recipe by ID requests
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

  // Handle the request method
  switch (method) {
    // Handle the GET request to fetch a recipe by its slug
    case 'GET':
      try {
        // Find the recipe by ID and populate the tags field
        const recipe = await Recipe.findOne({slug: recipeId}).populate('tags');
        // Return a 404 error if the recipe is not found
        if (!recipe) {
          return res.status(404).json({success: false, message: 'Recipe not found'});
        }
        // Create a flag to check if the recipe is in the user's favorites
        let isFavorite = false;
        // Get the user ID if the user is logged in
        const userId = req.user ? req.user.id : null;
        // Check if the user is logged in
        if (userId) {
          // Check if the recipe is in the user's favorites
          const favorite = await Favorite.findOne({userID: userId, recipeID: recipe._id});
          // Set the isFavorite flag to true if the recipe is in the user's favorites
          isFavorite = !!favorite;
        }
        // Find the author of the recipe
        const userObject = await User.findById(recipe.authorID);
        // Create a recipe object with the favorite and author fields
        const recipeObject = recipe.toObject();
        // Add the favorite and author fields to the recipe object
        recipeObject.favorite = isFavorite;
        recipeObject.author = userObject ? {
          // Add the author ID and name to the recipe object
          id: userObject._id,
          name: `${userObject.firstName} ${userObject.lastName}`,
        } : {id: '', name: ''};
        // Return the recipe object
        res.status(200).json({success: true, data: recipeObject});
      // Handle any errors
      } catch (error) {
        // Return a 500 error if there is an error
        res.status(500).json({success: false, message: error.message});
      }
      break;
    // Handle the PUT request to update a recipe by its slug
    case 'PUT':
      // Return a 401 error if the user is not logged in
      if (!req.user) {
        return res.status(401).json({success: false, message: 'Unauthorized'});
      }
      // Validate the recipe update request
      await validateRecipeUpdate(req, res, async () => {
        try {
          // Find the recipe by ID
          const recipe = await Recipe.findById(recipeId);
          // Return a 404 error if the recipe is not found
          if (!recipe) {
            return res.status(404).json({success: false, message: 'Recipe not found'});
          }
          // Return a 403 error if the user is not an admin or the author of the recipe
          if (!req.user.isAdmin && recipe.authorID.toString() !== req.user.id.toString()) {
            return res.status(403).json({success: false, message: 'Not authorized to update this recipe'});
          }
          // Extract the recipe data from the request body
          const {title, description, ingredients, cook_time, instructions, tags, type} = req.body;

          // Create an array to store tag IDs
          const tagIds = [];
          // Iterate over the tags
          if (tags) {
            // Iterate over the tags
            for (let tagName of tags) {
              // Trim the tag name
              tagName = tagName.trim();
              // Skip empty tags
              if (!tagName) continue;
              // Find the tag by name in a case-insensitive manner
              let tag = await Tag.findOne({name: tagName}).collation({locale: 'en', strength: 2});
              // Check if the tag exists
              if (!tag) {
                // Create a new tag if it does not exist
                tag = new Tag({name: tagName});
                // Save the tag to the database
                await tag.save();
              }
              // Add the tag ID to the list
              tagIds.push(tag._id);
            }
          }
          // Update the recipe with the new data
          const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, {
            title, // Set the title
            description, // Set the description
            ingredients, // Set the ingredients
            cook_time, // Set the cook time
            instructions, // Set the instructions
            tags: tagIds, // Set the tags
            type // Set the type
          }, {new: true});

          // Return the updated recipe
          res.status(200).json({success: true, data: updatedRecipe});
        // Handle any errors
        } catch (error) {
          // Return a 500 error if there is an error
          res.status(500).json({success: false, message: error.message});
        }
      });
      break;
    // Handle the DELETE request to delete a recipe by its slug
    case 'DELETE':
      // Return a 401 error if the user is not logged in
      if (!req.user) {
        return res.status(401).json({success: false, message: 'Unauthorized'});
      }
      try {
        // Find the recipe by ID
        const recipe = await Recipe.findById(recipeId);
        // Return a 404 error if the recipe is not found
        if (!recipe) {
          return res.status(404).json({success: false, message: 'Recipe not found'});
        }
        // Return a 403 error if the user is not an admin or the author of the recipe
        if (!req.user.isAdmin && recipe.authorID.toString() !== req.user.id.toString()) {
          return res.status(403).json({success: false, message: 'Not authorized to delete this recipe'});
        }
        // Delete the recipe by ID
        await Recipe.findByIdAndDelete(recipeId);
        // Delete all favorite records associated with this recipe
        await Favorite.deleteMany({recipeID: recipeId});
        // Return a success message
        res.status(200).json({success: true, message: 'Recipe deleted'});
      // Handle any errors
      } catch (error) {
        // Return a 500 error if there is an error
        res.status(500).json({success: false, message: error.message});
      }
      break;
    // Handle other request methods
    default:
      // Return a 405 error if the request method is not allowed
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      // Return a 405 error
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
