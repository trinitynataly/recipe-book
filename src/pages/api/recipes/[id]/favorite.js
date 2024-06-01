import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import Favorite from '@/models/Favorite';
import authenticate from '@/middleware/authenticate';

export default async function handler(req, res) {
    await dbConnect();
    await authenticate(req, res);
    const { method } = req;
    const recipeId = req.query.id;

    if (method === 'POST') {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const recipe = await Recipe.findById(recipeId);
            if (!recipe) {
                return res.status(404).json({ success: false, message: 'Recipe not found' });
            }
            const existingFavorite = await Favorite.findOne({ userID: req.user.id, recipeID: recipe._id });
            if (existingFavorite) {
                // If already a favorite, remove it
                await Favorite.deleteOne({ _id: existingFavorite._id });
                res.status(200).json({ success: true, message: 'Recipe removed from favorites', favorite: false });
            } else {
                // If not a favorite, add it
                const newFavorite = new Favorite({ userID: req.user.id, recipeID: recipe._id });
                await newFavorite.save();
                res.status(201).json({ success: true, message: 'Recipe added to favorites', favorite: true });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}