import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import Tag from '@/models/Tag';
import authenticate from '@/middleware/authenticate';

export default async function handler(req, res) {
    await dbConnect();

    authenticate(req, res, async () => {
        if (req.method === 'GET') {
            try {
                const { keyword, page = 1, per_page = 12 } = req.query;
                const query = {
                    $or: [
                        { title: { $regex: keyword, $options: 'i' } },
                        { description: { $regex: keyword, $options: 'i' } },
                        { ingredients: { $regex: keyword, $options: 'i' } },
                        { instructions: { $regex: keyword, $options: 'i' } },
                    ],
                };

                const pageInt = parseInt(page, 10);
                const perPageInt = parseInt(per_page, 10);
                const skip = (pageInt - 1) * perPageInt;

                const recipes = await Recipe.find(query)
                    .populate('tags')
                    .skip(skip)
                    .limit(perPageInt);

                const totalRecipes = await Recipe.countDocuments(query);
                const totalPages = Math.ceil(totalRecipes / perPageInt);

                res.status(200).json({
                    success: true,
                    data: recipes,
                    pagination: {
                        totalRecipes,
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
