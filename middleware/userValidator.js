const Joi = require('joi');
const {Roles} = require("../utils/enums");

const schema = Joi.object({
    name: Joi.string()
        .required()
        .trim()
        .min(2)
        .messages({
            'any.required': 'Name field is required.',
            'string.min': 'Name must be at least 2 characters',
            'string.base': 'Name must be text',
            'string.empty': 'Name cannot be empty'
        }),

    /*role: Joi.string()
        .valid(...Object.values(Roles))
        .default(Roles.USER)
        .messages({
            'any.only': `Role must be one of: ${Object.values(Roles).join(', ')}`
        }),*/

    email: Joi.string()
        .required()
        .trim()
        .email()
        .lowercase()
        .messages({
            'string.email': 'Email must be valid and contain "@"',
            'any.required': 'Email field is required.',
            'string.empty': 'Email cannot be empty',
            'string.base': 'Email must be text'
        }),

    password: Joi.string()
        .required()
        .min(5)
        .messages({
            'string.min': 'Password must be at least 5 characters',
            'string.base': 'Password must be text',
            'any.required': 'Password field is required.',
            'string.empty': 'Password cannot be empty'
        }),

    phoneNumber: Joi.string()
        .required()
        .trim()
        .length(8)
        .pattern(/^[0-9]{8}$/)
        .messages({
            'any.required': 'Phone number field is required.',
            'string.length': 'Phone number must be exactly 8 digits',
            'string.pattern.base': 'Phone number must only contain numbers',
            'string.empty': 'Phone number cannot be empty'
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .required()
        .trim()
        .email()
        .lowercase(),

    password: Joi.string()
        .required()
});


exports.validateUser = (req, res, next) => {
    const {error} = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({ errors });
    }
    next();
};

exports.validateLogin = (req, res, next) => {
    const {error} = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({ errors });
    }
    next();
};
