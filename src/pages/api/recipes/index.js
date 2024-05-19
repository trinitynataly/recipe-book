import dbConnect from '../../../lib/mongodb';
import Recipe from '../../../models/Recipe';
import Tag from '../../../models/Tag';
import authenticate from '../../../middleware/authenticate';
import { validateRecipeCreation } from '../../../validators/RecipeValidators';

export default async function handler(req, res) {
    await dbConnect();

    authenticate(req, res, async () => {
        if (req.method === 'GET') {
            // Fetch all recipes
            try {
                const { type, tag, favorite, page = 1, per_page = 20 } = req.query;
                // Initialize query
                let query = {};

                // Filter by type
                if (type) {
                    query.type = type;
                }

                // Filter by tag
                if (tag) {
                    const tagDoc = await Tag.findOne({ name: tag }).collation({ locale: 'en', strength: 2 });
                    if (tagDoc) {
                        query.tags = tagDoc._id;
                    }
                }

                // Filter by favorite
                if (favorite) {
                    const favoriteDocs = await Favorite.find({ userID: req.user._id }).select('recipeID');
                    const favoriteRecipeIds = favoriteDocs.map(fav => fav.recipeID);
                    query._id = { $in: favoriteRecipeIds };
                }

                // Pagination
                const pageInt = parseInt(page, 10);
                const perPageInt = parseInt(per_page, 10);
                const skip = (pageInt - 1) * perPageInt;

                // Fetch recipes
                const recipes = await Recipe.find(query)
                    .populate('tags')
                    .skip(skip)
                    .limit(perPageInt);

                // Get total count for pagination
                const totalRecipes = await Recipe.countDocuments(query);
                const totalPages = Math.ceil(totalRecipes / perPageInt);

                res.status(200).json({
                    success: true,
                    data: recipes,
                    pagination: {
                        totalRecipes,
                        totalPages,
                        currentPage: pageInt,
                        perPage: perPageInt
                    }
                });
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        } else if (req.method === 'POST') {
            // Validate and create a new recipe
            validateRecipeCreation(req, res, async () => {
                const { title, description, ingredients, cook_time, instructions, tags, type } = req.body;
                try {
                    // Handle tags
                    const tagIds = [];
                    for (let tagName of tags) {
                        tagName = tagName.trim();
                        let tag = await Tag.findOne({ name: tagName }).collation({ locale: 'en', strength: 2 });
                        
                        if (!tag) {
                            tag = new Tag({ name: tagName });
                            await tag.save();
                        }

                        tagIds.push(tag._id);
                    }

                    const newRecipe = new Recipe({
                        title,
                        description,
                        ingredients,
                        cook_time,
                        instructions,
                        tags: tagIds,
                        type,
                        authorID: req.user._id
                    });

                    await newRecipe.save();
                    res.status(201).json({ success: true, data: newRecipe });
                } catch (error) {
                    res.status(500).json({ success: false, message: error.message });
                }
            });
        } else {
            // Method not allowed
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
