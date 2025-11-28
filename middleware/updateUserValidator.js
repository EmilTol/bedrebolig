const Joi = require('joi');

const updateSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .optional()
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'string.base': 'Name must be text',
            'string.empty': 'Name cannot be empty'
        }),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .optional()
        .messages({
            'string.email': 'Email must be valid and contain "@"',
            'string.empty': 'Email cannot be empty',
            'string.base': 'Email must be text'
        }),

    password: Joi.string()
        .min(5)
        .optional()
        .allow('')
        .messages({
            'string.min': 'Password must be at least 5 characters',
            'string.base': 'Password must be text'
        }),

    phoneNumber: Joi.string()
        .trim()
        .length(8)
        .pattern(/^[0-9]{8}$/)
        .optional()
        .messages({
            'string.length': 'Phone number must be exactly 8 digits',
            'string.pattern.base': 'Phone number must only contain numbers',
            'string.empty': 'Phone number cannot be empty'
        })
}).min(1); // At least one field must be provided

exports.validateUserUpdate = (req, res, next) => {
    // Remove empty password field if present
    if (req.body.password === '') {
        delete req.body.password;
    }

    const {error} = updateSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({ errors });
    }
    next();
};