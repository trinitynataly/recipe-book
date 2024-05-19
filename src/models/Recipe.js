import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    cook_time: {
        type: Number,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    photo: {
        type: String, // URL to local storage
        required: false
    },
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
        required: true
    }
}, { timestamps: true });

const RecipeModel = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

export default RecipeModel;
