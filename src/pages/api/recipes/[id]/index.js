import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import Tag from '@/models/Tag';
import Favorite from '@/models/Favorite';
import User from '@/models/User';
import authenticate from '@/middleware/authenticate';
import { validateRecipeUpdate } from '@/validators/RecipeValidators';

export default async function handler(req, res) {
    await dbConnect();
    await authenticate(req, res);
    const { method } = req;
    const recipeId = req.query.id;

    switch (method) {
        case 'GET':
            // Fetch a recipe by ID
            try {
                const recipe = await Recipe.findById(recipeId).populate('tags');
                if (!recipe) {
                    return res.status(404).json({ success: false, message: 'Recipe not found' });
                }
                let isFavorite = false;
                const userId = req.user ? req.user.id : null;
        
                if (userId) {
                    // Check if the recipe is in the user's favorites
                    const favorite = await Favorite.findOne({ userID: userId, recipeID: recipeId });
                    isFavorite = !!favorite;
                }

                const userObject = await User.findById(recipe.authorID);
        
                const recipeObject = recipe.toObject();
                recipeObject.favorite = isFavorite;
                recipeObject.author = userObject ? {
                    id: userObject._id,
                    name: `${userObject.firstName} ${userObject.lastName}`,
                } : { id: '', name: '' };
                res.status(200).json({ success: true, data: recipeObject });
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
            break;
        case 'PUT':
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            // Update a recipe, only authors or admins can update
            validateRecipeUpdate(req, res, async () => {
                try {
                    const recipe = await Recipe.findById(recipeId);
                    if (!recipe) {
                        return res.status(404).json({ success: false, message: 'Recipe not found' });
                    }

                    if (!req.user.isAdmin && recipe.authorID.toString() !== req.user.id.toString()) {
                        return res.status(403).json({ success: false, message: 'Not authorized to update this recipe' });
                    }

                    const { title, description, ingredients, cook_time, instructions, tags, type } = req.body;
                    
                    // Handle tags
                    const tagIds = [];
                    if (tags) {
                        for (let tagName of tags) {
                            tagName = tagName.trim();
                            let tag = await Tag.findOne({ name: tagName }).collation({ locale: 'en', strength: 2 });
                            
                            if (!tag) {
                                tag = new Tag({ name: tagName });
                                await tag.save();
                            }
                            
                            tagIds.push(tag._id);
                        }
                    }

                    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, { title, description, ingredients, cook_time, instructions, tags: tagIds, type }, { new: true });
                    
                    res.status(200).json({ success: true, data: updatedRecipe });
                } catch (error) {
                    res.status(500).json({ success: false, message: error.message });
                }
            });
            break;
        case 'DELETE':
            // Delete a recipe, only authors or admins can delete
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            try {
                const recipe = await Recipe.findById(recipeId);
                if (!recipe) {
                    return res.status(404).json({ success: false, message: 'Recipe not found' });
                }

                if (!req.user.isAdmin && recipe.authorID.toString() !== req.user.id.toString()) {
                    return res.status(403).json({ success: false, message: 'Not authorized to delete this recipe' });
                }

                await Recipe.findByIdAndDelete(recipeId);
                res.status(200).json({ success: true, message: 'Recipe deleted' });
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
