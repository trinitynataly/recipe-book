/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 17/05/2024
A Mongoose model for the Recipe collection to store recipe data.
*/

// Import the mongoose library
import mongoose from 'mongoose';

// Define the Recipe schema
const RecipeSchema = new mongoose.Schema({
    // Define the title field
    title: {
        type: String, // Define the title data type
        required: true // Set the field as required
    },
    // Define the description field
    description: {
        type: String, // Define the description data type
        required: true // Set the field as required
    },
    // Define the ingredients field
    ingredients: {
        type: String, // Define the ingredients data type
        required: true // Set the field as required
    },
    // Define the cook time field
    cook_time: {
        type: Number, // Define the cook time data type
        required: true // Set the field as required
    },
    // Define the instructions field
    instructions: {
        type: String, // Define the instructions data type
        required: true // Set the field as required
    },
    // Define the tags field as an array of Tag references
    tags: [{
        type: mongoose.Schema.Types.ObjectId, // Define the tags data type as an array of ObjectIds
        ref: 'Tag' // Reference the Tag model
    }],
    // Define the photo field
    photo: {
        type: String, // URL to local storage
        required: false // Set the field as optional
    },
    // Define the authorID field
    authorID: {
        type: mongoose.Schema.Types.ObjectId, // Define the author ID data type
        ref: 'User', // Reference the User model
        required: true // Set the field as required
    },
    // Define the type field
    type: {
        type: String, // Define the type data type
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'], // Define the allowed values
        required: true // Set the field as required
    }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields

// Define the Recipe model with the Recipe schema if it does not exist
const RecipeModel = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

// Export the Recipe model
export default RecipeModel;
