import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    }
}, { timestamps: true });

FavoriteSchema.index({ userID: 1, recipeID: 1 }, { unique: true });

const FavoriteModel = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);

export default FavoriteModel;
