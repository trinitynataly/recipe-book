/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 17/05/2024
A Mongoose model for the User collection to store user data.
*/

// Import the mongoose library
import mongoose from 'mongoose';
// Import the hashPassword function from the auth library
import { hashPassword } from '@/lib/auth.js';

// Define the User schema
const UserSchema = new mongoose.Schema({
    // Define the email field
    email: {
        type: String, // Define the email data type
        required: true, // Set the field as required
        unique: true, // Set the field as unique
        lowercase: true // Convert the email to lowercase
    },
    // Define the password field
    password: {
        type: String, // Define the password data type
        required: true // Set the field as required
    },
    // Define the first name field
    firstName: {
        type: String, // Define the first name data type
        required: true // Set the field as required
    },
    // Define the last name field
    lastName: {
        type: String, // Define the last name data type
        required: true // Set the field as required
    },
    // Define the role field
    isActive: {
        type: Boolean, // Define the role data type
        default: true // Set the default value
    },
    // Define the isAdmin field
    isAdmin: {
        type: Boolean, // Define the isAdmin data type
        default: false // Set the default value
    }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
    // Check if the password is modified
    if (this.isModified('password')) {
        // Hash the password before saving the user
        this.password = await hashPassword(this.password);
    }
    // Continue with the save operation
    next();
});


// Pre-update hook to hash password on update
UserSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    // Check if the password is being modified
    if (update.password) {
        // Hash the password before updating the user
        update.password = await hashPassword(update.password);
        this.setUpdate(update); // Ensure the updated document has the hashed password
    }
    // Continue with the update operation
    next();
});

// Define the User model with the User schema if it does not exist
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

// Export the User model
export default UserModel;