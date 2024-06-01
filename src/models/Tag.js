/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 17/05/2024
A Mongoose model for the Tag collection to store recipe tags.
*/

// Import the mongoose library
import mongoose from 'mongoose';

// Define the Tag schema
const TagSchema = new mongoose.Schema({
    // Define the name field
    name: {
        type: String, // Define the name data type
        required: true, // Set the field as required
        unique: true // Set the field as unique
    }
});

// Create a unique index for the name field
TagSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

// Define the Tag model with the Tag schema if it does not exist
const TagModel = mongoose.models.Tag || mongoose.model('Tag', TagSchema);

// Export the Tag model
export default TagModel;
