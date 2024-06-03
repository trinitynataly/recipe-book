/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 24/05/2024
Recipe Model validators for the Recipe API routes.
*/

// Import the Joi library for input validation
import Joi from 'joi';

// Schema for creating a new recipe
const recipeCreationSchema = Joi.object({
  title: Joi.string().required(), // Title is required
  description: Joi.string().required(), // Description is required
  ingredients: Joi.string().required(), // Ingredients are required
  cook_time: Joi.number().integer().positive().required(), // Cook time is required
  instructions: Joi.string().required(), // Instructions are required
  tags: Joi.array().items(Joi.string().allow(null, '')).optional(), // Tags are optional, but must be an array of strings
  type: Joi.string().valid('Breakfast', 'Lunch', 'Dinner', 'Snacks').required() // Type is required and must be one of the specified values
});

/**
 * Middleware function to validate the recipe creation input
 * @param req - the request object
 * @param res - the response object
 * @param next - the next middleware function
 * @returns {Promise<void>}
 */
const validateRecipeCreation = async (req, res, next) => {
  // Validate the request body against the schema
  try {
    // If the validation passes, continue to the next middleware
    await recipeCreationSchema.validateAsync(req.body);
    // Call the next middleware
    next();
  } catch (error) {
    // If the validation fails, return an error response
    res.status(400).json({ success: false, message: error.message });
  }
};

// Schema for updating an existing recipe
const recipeUpdateSchema = Joi.object({
  title: Joi.string().optional(), // Title is optional
  description: Joi.string().optional(), // Description is optional
  ingredients: Joi.string().optional(), // Ingredients are optional
  cook_time: Joi.number().integer().positive().optional(), // Cook time is optional
  instructions: Joi.string().optional(), // Instructions are optional
  tags: Joi.array().items(Joi.string().allow(null, '')).optional(), // Tags are optional, but must be an array of strings
  type: Joi.string().valid('Breakfast', 'Lunch', 'Dinner', 'Snacks').optional() // Type is optional and must be one of the specified values
});

/**
 * Middleware function to validate the recipe update input
 * @param req - the request object
 * @param res - the response object
 * @param next - the next middleware function
 * @returns {Promise<void>}
 */
const validateRecipeUpdate = async (req, res, next) => {
  // Validate the request body against the schema
  try {
    // If the validation passes, continue to the next middleware
    await recipeUpdateSchema.validateAsync(req.body);
    // Call the next middleware
    next();
  } catch (error) {
    // If the validation fails, return an error response
    res.status(400).json({ success: false, message: error.message });
  }
};

// Export the validation middleware functions
export { validateRecipeCreation, validateRecipeUpdate };
