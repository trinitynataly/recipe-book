/*
Version: 1.8
Last edited by: Natalia Pakhomova
Last edit date: 29/05/2024
An API route to fetch and create recipes with pagination and filtering.
*/

// Import the database connection
import dbConnect from '@/lib/mongodb';
// Import the Recipe, Tag, and Favorite models
import Recipe from '@/models/Recipe';
import Tag from '@/models/Tag';
import Favorite from '@/models/Favorite';
// Import the authenticate middleware
import authenticate from '@/middleware/authenticate';
// Import the validateRecipeCreation function
import {validateRecipeCreation} from '@/validators/RecipeValidators';

/**
 * Handler for the recipe List and Create
 * @param req - The request object
 * @param res - The response object
 * @returns {Promise<*>}
 */
export default async function handler(req, res) {
  // Connect to the MongoDB database
  await dbConnect();
  // Authenticate the user
  await authenticate(req, res);
  // Serve GET request to fetch a list of recipes
  if (req.method === 'GET') {
    // Fetch all recipes
    try {
      // Extract the query parameters
      const {type, tag, favorite, page = 1, per_page = 12} = req.query;
      // Get the user ID if the user is logged in
      const userId = req.user ? req.user.id : null;
      // Create a query object
      let query = {};

      // Filter by type
      if (type) {
        // Use case-insensitive regex to match the type
        query.type = {$regex: new RegExp(`^${type}$`, 'i')};
      }

      // Filter by tag
      if (tag) {
        // Find the tag by name and add it to the query
        const tagDoc = await Tag.findOne({name: tag}).collation({locale: 'en', strength: 2});
        // If the tag exists, add it to the query
        if (tagDoc) {
          // Find recipes with the tag
          query.tags = tagDoc._id;
        }
      }

      // Get the user's favorite recipe IDs
      let userFavoriteRecipeIds = [];

      // Check if the user is logged in
      if (userId) {
        // Fetch the user's favorite recipes if user is logged in
        const userFavorites = await Favorite.find({userID: userId}).select('recipeID');
        // Map the recipe IDs to strings
        userFavoriteRecipeIds = userFavorites.map(fav => fav.recipeID.toString());

        // Filter by favorite if needed
        if (favorite) {
          query._id = {$in: userFavoriteRecipeIds};
        }
      }

      // Get the page number
      const pageInt = parseInt(page, 10);
      // Get the number of recipes per page
      const perPageInt = parseInt(per_page, 10);
      // Calculate the number of recipes to skip
      const skip = (pageInt - 1) * perPageInt;

      // Fetch recipes from the database
      const recipes = await Recipe.find(query)
        .populate('tags') // Populate the tags field
        .skip(skip) // Skip the first n recipes
        .limit(perPageInt); // Limit the number of recipes

      // Get total count for pagination
      const totalRecipes = await Recipe.countDocuments(query);
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalRecipes / perPageInt);

      // Add favorite field to each recipe if user is logged in
      const recipesWithFavorite = recipes.map(recipe => {
        // Convert the recipe to a plain object
        const recipeObject = recipe.toObject();
        // Check if user ID exists
        if (userId) {
          // Check if the recipe ID is in the user's favorite recipes
          recipeObject.favorite = userFavoriteRecipeIds.includes(recipeObject._id.toString());
        } else {
          // favourite field is false if user is not logged in
          recipeObject.favorite = false;
        }
        // Return the updated recipe object
        return recipeObject;
      });

      // Send the response
      res.status(200).json({
        success: true, // Indicate success
        data: recipesWithFavorite, // Send the recipes
        pagination: { // Send pagination data
          totalRecipes, // Total number of recipes
          totalPages, // Total number of pages
          currentPage: pageInt, // Current page
          perPage: perPageInt // Recipes per page
        }
      });
    } catch (error) { // Handle errors
      // Send an error response
      res.status(500).json({success: false, message: error.message});
    }
  // Serve POST request to create a new recipe
  } else if (req.method === 'POST') {
    // Check if the user is logged in
    if (!req.user) {
      // Send an unauthorized response if the user is not logged in
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }
    // Validate the recipe creation request
    validateRecipeCreation(req, res, async () => {
      // Extract the recipe data from the request body
      const {title, description, ingredients, cook_time, instructions, tags, type} = req.body;
      // Create a new recipe
      try {
        // Create an array to store tag IDs
        const tagIds = [];
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

        // Create a new recipe object
        const newRecipe = new Recipe({
          title, // Set the title
          description, // Set the description
          ingredients, // Set the ingredients
          cook_time, // Set the cook time
          instructions, // Set the instructions
          tags: tagIds, // Set the tags
          type, // Set the type
          authorID: req.user.id // Set the author ID
        });

        // Save the recipe to the database
        await newRecipe.save();
        // Send a success response
        res.status(201).json({success: true, data: newRecipe});
      } catch (error) { // Handle errors
        // Send an error response
        res.status(500).json({success: false, message: error.message});
      }
    });
  // Handle other request methods
  } else {
    // Set the allowed methods in the response header
    res.setHeader('Allow', ['GET', 'POST']);
    // Send a 405 Method Not Allowed response
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
