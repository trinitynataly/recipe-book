/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 17/05/2024
A Mongoose model for the Favorite collection to store user favorite recipes.
*/

// Import the mongoose library
import mongoose from 'mongoose';

// Define the Favorite schema
const FavoriteSchema = new mongoose.Schema({
    // Define the user ID field
    userID: {
        type: mongoose.Schema.Types.ObjectId, // Define the user ID data type
        ref: 'User', // Reference the User model
        required: true // Set the field as required
    },
    // Define the recipe ID field
    recipeID: {
        type: mongoose.Schema.Types.ObjectId, // Define the recipe ID data type
        ref: 'Recipe', // Reference the Recipe model
        required: true // Set the field as required
    }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields

// Create a unique index for the user ID and recipe ID
FavoriteSchema.index({ userID: 1, recipeID: 1 }, { unique: true });

// Define the Favorite model with the Favorite schema if it does not exist
const FavoriteModel = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);

// Export the Favorite model
export default FavoriteModel;
