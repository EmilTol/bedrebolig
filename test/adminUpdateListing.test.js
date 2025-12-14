const request = require('supertest');
const express = require('express');
const Listings = require('../models/listings');
const adminService = require('../services/adminService');

// Mock the models and services
jest.mock('../models/listings');
jest.mock('../services/adminService');

// Mock authentication middleware
jest.mock('../middleware/authentication', () => ({
    authentication: (req, res, next) => {
        req.user = { id: 'admin123', role: 'admin', email: 'admin@test.dk' };
        next();
    },
    authorize: (...roles) => (req, res, next) => next()
}));

const adminController = require('../controllers/adminController');

// Create test app
const app = express();
app.use(express.json());

// Create test route with same structure as actual route
const { authentication } = require('../middleware/authentication');
app.put('/api/admin/listings/:id', authentication, adminController.updateListing);

describe('Admin Update Listing', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // TEST 1: Update listing status successfully
    it('should update listing and return 200', async () => {
        const mockListing = {
            _id: 'listing123',
            title: 'Villa i Næstved',
            status: 'active'
        };

        adminService.updateListing.mockResolvedValue(mockListing);

        const response = await request(app)
            .put('/api/admin/listings/listing123')
            .send({ status: 'active' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('listing has been updated');
        expect(response.body.listing.status).toBe('active');
        expect(adminService.updateListing).toHaveBeenCalledWith('listing123', { status: 'active' });
    });

    // TEST 2: Listing not found
    it('should return 404 when listing does not exist', async () => {
        adminService.updateListing.mockRejectedValue(new Error('listing not found'));

        const response = await request(app)
            .put('/api/admin/listings/nonexistent123')
            .send({ status: 'active' });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('listing not found');
    });

    // TEST 3: Database error
    it('should return 500 when database error occurs', async () => {
        adminService.updateListing.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .put('/api/admin/listings/listing123')
            .send({ status: 'active' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });

    // TEST 4: Update to rejected status
    it('should update listing status to rejected', async () => {
        const mockListing = {
            _id: 'listing123',
            title: 'Villa i Næstved',
            status: 'rejected'
        };

        adminService.updateListing.mockResolvedValue(mockListing);

        const response = await request(app)
            .put('/api/admin/listings/listing123')
            .send({ status: 'rejected' });

        expect(response.status).toBe(200);
        expect(response.body.listing.status).toBe('rejected');
    });

});
