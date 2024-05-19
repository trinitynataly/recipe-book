import dbConnect from '../../../../lib/mongodb';
import Recipe from '../../../../models/Recipe';
import authenticate from '../../../../middleware/authenticate';
import upload from '../../../../middleware/upload';
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

        if (method === 'GET') {
            // Fetch photo
            const photoPath = recipe.photo ? path.join(process.cwd(), 'uploads', recipe.photo) : path.resolve('public/photo-stub.jpg');
            if (!fs.existsSync(photoPath)) {
                return res.status(404).json({ success: false, message: 'Photo not found' });
            }

            const photo = fs.readFileSync(photoPath);
            res.setHeader('Content-Type', 'image/jpeg'); // Adjust the content type based on your image type
            res.send(photo);
        } else {
            // Authenticate for POST and DELETE methods
            authenticate(req, res, async () => {
                if (method === 'POST') {
                    // Handle file upload to a temporary location
                    upload.single('photo')(req, res, async (err) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: err.message });
                        }

                        // Only authors or admins can upload photos
                        if (!req.user.isAdmin && recipe.authorID.toString() !== req.user._id.toString()) {
                            // Delete the temporary file if not authorized
                            fs.unlink(req.file.path, () => {});
                            return res.status(403).json({ success: false, message: 'Not authorized to upload photo for this recipe' });
                        }

                        // Delete existing photo if it exists
                        if (recipe.photo) {
                            const existingPhotoPath = path.join(process.cwd(), 'uploads', recipe.photo);
                            if (fs.existsSync(existingPhotoPath)) {
                                fs.unlinkSync(existingPhotoPath);
                            }
                        }

                        // Move the file to the final destination with the original extension
                        const extension = path.extname(req.file.originalname).toLowerCase();
                        const finalFileName = `${recipeId}${extension}`;
                        const finalPath = path.join(process.cwd(), 'uploads', finalFileName);
                        fs.rename(req.file.path, finalPath, async (err) => {
                            if (err) {
                                return res.status(500).json({ success: false, message: err.message });
                            }

                            recipe.photo = finalFileName;
                            await recipe.save();

                            res.status(200).json({ success: true, data: recipe });
                        });
                    });
                } else if (method === 'DELETE') {
                    // Only authors or admins can delete photos
                    if (!req.user.isAdmin && recipe.authorID.toString() !== req.user._id.toString()) {
                        return res.status(403).json({ success: false, message: 'Not authorized to delete photo for this recipe' });
                    }

                    if (recipe.photo) {
                        const photoPath = path.join(process.cwd(), 'uploads', recipe.photo);
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
                    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
                    res.status(405).end(`Method ${method} Not Allowed`);
                }
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default handler;
