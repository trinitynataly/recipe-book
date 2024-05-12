import User from '../models/User';

import Joi from 'joi';

const validateUniqueEmail = async (email, userId) => {
    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower, _id: { $ne: userId } });
    if (existingUser) {
        throw new Error('Email already in use.');
    }
    return emailLower;  // Return the email in lowercase to ensure consistency in DB.
};

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

const userRegistrationSchema = Joi.object({
    email: Joi.string().email().required().external(value => validateUniqueEmail(value)),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
});

const validateUserRegistration = async (req, res, next) => {
    try {
        await userRegistrationSchema.validateAsync(req.body);
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const userCreationSchema = Joi.object({
    email: Joi.string().email().required().external(value => validateUniqueEmail(value)),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    isActive: Joi.boolean(),
    isAdmin: Joi.boolean()
});

const validateUserCreation = async (req, res, next) => {
    try {
        await userCreationSchema.validateAsync(req.body);
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const userUpdateSchema = Joi.object({
    email: Joi.string().email().required().external(async (value, helpers) => {
        // Assuming `userId` is passed through context when validating
        return await validateUniqueEmail(value, helpers.state.ancestors[0].userId);
    }),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    isActive: Joi.boolean(),
    isAdmin: Joi.boolean()
});

const validateUserUpdate = async (req, res, next) => {
    try {
        await userUpdateSchema.validateAsync(req.body, { context: { userId: req.query.id } });
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export { validateLogin, validateUniqueEmail, validateUserRegistration, validateUserCreation, validateUserUpdate };