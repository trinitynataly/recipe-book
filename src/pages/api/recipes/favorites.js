import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import Favorite from '@/models/Favorite';
import authenticate from '@/middleware/authenticate';

export default async function handler(req, res) {
    await dbConnect();

    authenticate(req, res, async () => {
        if (req.method === 'GET') {
            try {
                const userId = req.user._id;
                const { page = 1, per_page = 12 } = req.query;

                const pageInt = parseInt(page, 10);
                const perPageInt = parseInt(per_page, 10);
                const skip = (pageInt - 1) * perPageInt;

                // Fetch the user's favorite recipes
                const favoriteRecipes = await Favorite.find({ userID: userId })
                    .populate({
                        path: 'recipeID',
                        populate: { path: 'tags' } // populate tags if needed
                    })
                    .skip(skip)
                    .limit(perPageInt);

                const totalFavorites = await Favorite.countDocuments({ userID: userId });
                const totalPages = Math.ceil(totalFavorites / perPageInt);

                const recipes = favoriteRecipes.map(fav => fav.recipeID);

                const recipesWithFavorite = recipes.map(recipe => {
                    const recipeObject = recipe.toObject();
                    recipeObject.favorite = true;
                    return recipeObject;
                });

                res.status(200).json({
                    success: true,
                    data: recipesWithFavorite,
                    pagination: {
                        totalRecipes: totalFavorites,
                        totalPages,
                        currentPage: pageInt,
                        perPage: perPageInt,
                    },
                });
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        } else {
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
