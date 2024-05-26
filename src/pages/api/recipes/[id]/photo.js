import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import authenticate from '@/middleware/authenticate';
import upload from '@/middleware/upload';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false
    }
};

const handler = async (req, res) => {
    await dbConnect();
    const { method } = req;
    const recipeId = req.query.id;

    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ success: false, message: 'Recipe not found' });
        }

        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Authenticate for POST and DELETE methods
        authenticate(req, res, async () => {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            if (!req.user.isAdmin && recipe.authorID.toString() !== req.user._id.toString()) {
                return res.status(403).json({ success: false, message: 'Not authorized to update this recipe' }); 
            }
            if (method === 'POST') {
                // Handle file upload to a temporary location
                upload.single('photo')(req, res, async (err) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: err.message });
                    }
                    // Delete existing photo if it exists
                    if (recipe.photo) {
                        const existingPhotoPath = path.join(uploadsDir, recipe.photo);
                        if (fs.existsSync(existingPhotoPath)) {
                            fs.unlinkSync(existingPhotoPath);
                        }
                    }

                    // Move the file to the final destination with the original extension
                    const timestamp = Date.now();
                    const extension = path.extname(req.file.originalname).toLowerCase();
                    const finalFileName = `${recipeId}_${timestamp}${extension}`;
                    const finalPath = path.join(uploadsDir, finalFileName);
                    fs.rename(req.file.path, finalPath, async (err) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: err.message });
                        }

                        recipe.photo = finalFileName; // Save only the file name
                        await recipe.save();

                        res.status(200).json({ success: true, data: recipe });
                    });
                });
            } else if (method === 'DELETE') {
                if (recipe.photo) {
                    const photoPath = path.join(uploadsDir, recipe.photo);
                    if (fs.existsSync(photoPath)) {
                        fs.unlink(photoPath, async (err) => {
                            if (err) {
                                return res.status(500).json({ success: false, message: err.message });
                            }

                            recipe.photo = null;
                            await recipe.save();

                            res.status(200).json({ success: true, message: 'Photo deleted' });
                        });
                    } else {
                        return res.status(404).json({ success: false, message: 'Photo not found' });
                    }
                } else {
                    return res.status(404).json({ success: false, message: 'Photo not found' });
                }
            } else {
                res.setHeader('Allow', ['POST', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default handler;
