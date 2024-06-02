/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 2/06/2024
A Mongoose model for the Recipe collection to store recipe data.
*/

// Import the mongoose library
import mongoose from 'mongoose';
// Import the slugify and generateUniqueSlug utility functions
import { slugify, generateUniqueSlug } from '@/lib/utils';
// Import the categories data
import categories from '@/data/categories.json';

// Get the category names from the categories data
const categoryNames = categories.map(category => category.name);

// Define the Recipe schema
const RecipeSchema = new mongoose.Schema({
    // Define the title field
    title: {
        type: String, // Define the title data type
        required: true // Set the field as required
    },
    // Define the slug field
    slug: {
        type: String, // Define the slug data type
        required: false // Set the field as required
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
        enum: categoryNames, // Define the allowed values from the category JSON data
        required: true // Set the field as required
    }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields

// Create a hook to generate a unique slug before saving the recipe
RecipeSchema.pre('save', async function(next) {
    // Generate a unique slug based on the title
    const baseSlug = slugify(this.title);
    // Ensure the slug is unique and save it 
    this.slug = await generateUniqueSlug(this.constructor, baseSlug, 0, this._id);
    // Continue with the save operation
    next();
});

// Create a hook to generate a unique slug before updating the recipe
RecipeSchema.pre('findOneAndUpdate', async function(next) {
    // Get the update object
    const update = this.getUpdate();
    // Check if the title is being modified
    if (update.title) {
        // Generate a unique slug based on the updated title
        const baseSlug = slugify(update.title);
        // Ensure the slug is unique and update it
        update.slug = await generateUniqueSlug(this.model, baseSlug, 0, this._id);
        // Update the document with the new slug
        this.setUpdate(update);
    }
    // Continue with the update operation
    next();
});

// Define the Recipe model with the Recipe schema if it does not exist
const RecipeModel = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

// Export the Recipe model
export default RecipeModel;
