const Joi = require('joi');
const { Status, BuildingType } = require('../utils/enums');

const createListingValidation = Joi.object({
    // Listing information
    user_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/) // MongoDB ObjectId format
        .optional()
        .messages({
            'string.pattern.base': 'user_id must be a valid MongoDB ObjectId'
        }),

    title: Joi.string()
        .min(5)
        .max(200)
        .required()
        .messages({
            'string.min': 'Title must be at least 5 characters long',
            'string.max': 'Title cannot exceed 200 characters',
            'any.required': 'Title is required'
        }),

    description: Joi.string()
        .min(20)
        .max(2000)
        .required()
        .messages({
            'string.min': 'Description must be at least 20 characters long',
            'string.max': 'Description cannot exceed 2000 characters',
            'any.required': 'Description is required'
        }),

    status: Joi.string()
        .valid(...Object.values(Status))
        .default(Status.UNDERREVIEW)
        .messages({
            'any.only': `Status must be one of: ${Object.values(Status).join(', ')}`
        }),

    images: Joi.array()
        .items(Joi.string().uri())
        .max(20)
        .default([]),

    favoritedBy: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .optional(),

    // Property information
    buildingType: Joi.string()
        .valid(...Object.values(BuildingType))
        .required()
        .messages({
            'any.only': `Building type must be one of: ${Object.values(BuildingType).join(', ')}`,
            'any.required': 'Building type is required'
        }),

    price: Joi.object({
        purchasePrice: Joi.number()
            .positive()
            .required()
            .messages({
                'number.positive': 'Purchase price must be a positive number',
                'any.required': 'Purchase price is required'
            }),

        monthlyOwnershipCost: Joi.number()
            .positive()
            .required()
            .messages({
                'number.positive': 'Monthly ownership cost must be a positive number',
                'any.required': 'Monthly ownership cost is required'
            }),

        downPayment: Joi.number()
            .positive()
            .required()
            .messages({
                'number.positive': 'Down payment must be a positive number',
                'any.required': 'Down payment is required'
            }),

        brutto: Joi.number()
            .positive()
            .required()
            .messages({
                'number.positive': 'Brutto must be a positive number',
                'any.required': 'Brutto is required'
            }),

        netto: Joi.number()
            .positive()
            .required()
            .messages({
                'number.positive': 'Netto must be a positive number',
                'any.required': 'Netto is required'
            })
    }).required(),

    location: Joi.object({
        city: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.min': 'City must be at least 2 characters long',
                'any.required': 'City is required'
            }),

        postalCode: Joi.number()
            .integer()
            .min(1000)
            .max(9999)
            .required()
            .messages({
                'number.min': 'Postal code must be a valid Danish postal code (1000-9999)',
                'number.max': 'Postal code must be a valid Danish postal code (1000-9999)',
                'any.required': 'Postal code is required'
            }),

        address: Joi.string()
            .min(5)
            .max(200)
            .required()
            .messages({
                'string.min': 'Address must be at least 5 characters long',
                'any.required': 'Address is required'
            }),

        coordinates: Joi.object({
            type: Joi.string()
                .valid('Point')
                .default('Point'),

            coordinates: Joi.array()
                .length(2)
                .items(
                    Joi.number().min(-180).max(180), // longitude
                    Joi.number().min(-90).max(90)    // latitude
                )
                .required()
                .messages({
                    'array.length': 'Coordinates must contain exactly 2 numbers [longitude, latitude]',
                    'any.required': 'Coordinates are required'
                })
        }).required()
    }).required(),

    rooms: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .required()
        .messages({
            'number.min': 'Rooms must be at least 1',
            'number.max': 'Rooms cannot exceed 50',
            'any.required': 'Number of rooms is required'
        }),

    squareMeters: Joi.number()
        .positive()
        .min(10)
        .max(10000)
        .required()
        .messages({
            'number.min': 'Square meters must be at least 10',
            'number.max': 'Square meters cannot exceed 10000',
            'any.required': 'Square meters is required'
        }),

    lotSize: Joi.number()
        .positive()
        .optional()
        .messages({
            'number.positive': 'Lot size must be a positive number'
        }),

    basementSize: Joi.number()
        .positive()
        .optional()
        .messages({
            'number.positive': 'Basement size must be a positive number'
        }),

    buildYear: Joi.number()
        .integer()
        .min(1800)
        .max(new Date().getFullYear())
        .required()
        .messages({
            'number.min': 'Build year must be after 1800',
            'number.max': `Build year cannot be in the future`,
            'any.required': 'Build year is required'
        }),

    renovationYear: Joi.number()
        .integer()
        .min(Joi.ref('buildYear'))
        .max(new Date().getFullYear())
        .optional()
        .messages({
            'number.min': 'Renovation year must be after build year',
            'number.max': 'Renovation year cannot be in the future'
        }),

    floors: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .required()
        .messages({
            'number.min': 'Floors must be at least 1',
            'number.max': 'Floors cannot exceed 100',
            'any.required': 'Number of floors is required'
        }),

    apartmentFloor: Joi.string()
        .max(10)
        .optional()
        .messages({
            'string.max': 'Apartment floor cannot exceed 10 characters'
        }),

    energyRating: Joi.string()
        .valid('A', 'B', 'C', 'D', 'E', 'F', 'G')
        .required()
        .messages({
            'any.only': 'Energy rating must be between A and G',
            'any.required': 'Energy rating is required'
        }),

    evaluation: Joi.string()
        .max(1000)
        .optional()
});

module.exports = { createListingValidation };