import dbConnect from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import authenticate from '@/middleware/authenticate';

export default async function handler(req, res) {
    await dbConnect();
    await authenticate(req, res);


    if (req.method === 'GET') {
        try {
            const userId = req.user ? req.user.id : null;  // Check if user is logged in
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { page = 1, per_page = 12 } = req.query;

            const pageInt = parseInt(page, 10);
            const perPageInt = parseInt(per_page, 10);
            const skip = (pageInt - 1) * perPageInt;

            // Fetch the user's favorite recipes
            const favoriteRecipes = await Favorite.find({ userID: userId })
                .populate({
                    path: 'recipeID',
                    populate: { path: 'tags' } // populate tags if needed
                });

            // Filter out favorite records that do not have corresponding recipe records
            const validFavoriteRecipes = favoriteRecipes.filter(fav => fav.recipeID);

            const totalFavorites = validFavoriteRecipes.length;
            const totalPages = Math.ceil(totalFavorites / perPageInt);

            // Paginate the valid favorite recipes
            const paginatedFavorites = validFavoriteRecipes.slice(skip, skip + perPageInt);

            const recipes = paginatedFavorites.map(fav => fav.recipeID);

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
}
