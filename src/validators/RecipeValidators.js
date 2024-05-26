import Joi from 'joi';
import Recipe from '@/models/Recipe';

// Schema for creating a new recipe
const recipeCreationSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    ingredients: Joi.string().required(),
    cook_time: Joi.number().integer().positive().required(),
    instructions: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).optional(),
    type: Joi.string().valid('Breakfast', 'Lunch', 'Dinner', 'Snacks').required()
});

const validateRecipeCreation = async (req, res, next) => {
    try {
        await recipeCreationSchema.validateAsync(req.body);
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Schema for updating an existing recipe
const recipeUpdateSchema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    ingredients: Joi.string().optional(),
    cook_time: Joi.number().integer().positive().optional(),
    instructions: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    type: Joi.string().valid('Breakfast', 'Lunch', 'Dinner', 'Snacks').optional()
});

const validateRecipeUpdate = async (req, res, next) => {
    try {
        await recipeUpdateSchema.validateAsync(req.body);
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export { validateRecipeCreation, validateRecipeUpdate };
