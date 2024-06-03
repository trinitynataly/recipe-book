/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 24/05/2024
User Model validators for User Registration, Login, and Update
*/

// Import the User model
import User from '@/models/User';
// Import the Joi library for input validation
import Joi from 'joi';

/**
 * Function to validate the uniqueness of the email address.
 * @param email - the email address
 * @param userId - the user ID (if updating an existing user)
 * @returns {Promise<string>} - the email address in lowercase
 */
const validateUniqueEmail = async (email, userId) => {
  // Ensure the email is in lowercase
  const emailLower = email.toLowerCase();
  // Check if the email is already in use by another user
  const existingUser = await User.findOne({ email: emailLower, _id: { $ne: userId } });
  // If the email is already in use, throw an error
  if (existingUser) {
    throw new Error('Email already in use.');
  }
// Return the email in lowercase to ensure consistency in DB
return emailLower;
};

// Schema for user registration
const userRegistrationSchema = Joi.object({
  // Email is required and must be a valid email address
  email: Joi.string().email().required().external(value => validateUniqueEmail(value)),
  // Password is required and must be at least 6 characters long
  password: Joi.string().min(6).required(),
  // First name is required
  firstName: Joi.string().required(),
  // Last name is required
  lastName: Joi.string().required()
});

/**
 * Middleware function to validate the user registration input
 * @param req - the request object
 * @param res - the response object
 * @param next - the next middleware function
 * @returns {Promise<void>}
 */
const validateUserRegistration = async (req, res, next) => {
  // Validate the request body against the schema
  try {
    // If the validation passes, continue to the next middleware
    await userRegistrationSchema.validateAsync(req.body);
    // Call the next middleware
    next();
  } catch (error) {
    // If the validation fails, return an error response
    res.status(400).json({ success: false, message: error.message });
  }
};

// Schema for creating a new user
const userCreationSchema = Joi.object({
  // Email is required and must be a valid email address
  email: Joi.string().email().required().external(value => validateUniqueEmail(value)),
  // Password is required and must be at least 6 characters long
  password: Joi.string().min(6).required(),
  // First name is required
  firstName: Joi.string().required(),
  // Last name is required
  lastName: Joi.string().required(),
  // isActive is optional and must be a boolean
  isActive: Joi.boolean(),
  // isAdmin is optional and must be a boolean
  isAdmin: Joi.boolean()
});

/**
 * Middleware function to validate the user creation input
 * @param req - the request object
 * @param res - the response object
 * @param next - the next middleware function
 * @returns {Promise<void>}
 */
const validateUserCreation = async (req, res, next) => {
  // Validate the request body against the schema
  try {
    // If the validation passes, continue to the next middleware
    await userCreationSchema.validateAsync(req.body);
    // Call the next middleware
    next();
  } catch (error) {
    // If the validation fails, return an error response
    res.status(400).json({ success: false, message: error.message });
  }
};

// Schema for updating an existing user
const userUpdateSchema = Joi.object({
  // Email is required and must be a valid email address
  email: Joi.string().email().required().external(async (value, helpers) => {
    // Validate the email address for uniqueness
    return await validateUniqueEmail(value, helpers.state.ancestors[0].userId);
  }),
  // First name is required
  firstName: Joi.string().required(),
  // Last name is required
  lastName: Joi.string().required(),
  // isActive is optional and must be a boolean
  isActive: Joi.boolean(),
  // isAdmin is optional and must be a boolean
  isAdmin: Joi.boolean()
});

/**
 * Middleware function to validate the user update input
 * @param req - the request object
 * @param res - the response object
 * @param next - the next middleware function
 * @returns {Promise<void>}
 */
const validateUserUpdate = async (req, res, next) => {
  // Validate the request body against the schema
  try {
    // If the validation passes, continue to the next middleware
    await userUpdateSchema.validateAsync(req.body, { context: { userId: req.query.id } });
    // Call the next middleware
    next();
  } catch (error) {
    // If the validation fails, return an error response
    res.status(400).json({ success: false, message: error.message });
  }
}

// Export the validation functions
export { validateUniqueEmail, validateUserRegistration, validateUserCreation, validateUserUpdate };