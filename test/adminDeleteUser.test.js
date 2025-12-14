const request = require('supertest');
const express = require('express');
const User = require('../models/users');
const adminService = require('../services/adminService');

// Mock the models and services
jest.mock('../models/users');
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
const { authentication, authorize } = require('../middleware/authentication');
const { Roles } = require('../utils/enums');
app.delete('/api/admin/users/:id', authentication, authorize(Roles.ADMIN), adminController.deleteUser);

describe('Admin Delete User', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // TEST 1: Delete user successfully
    it('should delete user and return 200', async () => {
        const mockUser = {
            _id: 'user123',
            name: 'Test User',
            email: 'test@test.dk'
        };

        adminService.deleteUser.mockResolvedValue(mockUser);

        const response = await request(app)
            .delete('/api/admin/users/user123');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('user has been deleted');
        expect(response.body.user.email).toBe('test@test.dk');
        expect(adminService.deleteUser).toHaveBeenCalledWith('user123', 'admin123');
    });

    // TEST 2: Cannot delete yourself
    it('should return 403 when admin tries to delete themselves', async () => {
        adminService.deleteUser.mockRejectedValue(new Error('you cannot delete your own account'));

        const response = await request(app)
            .delete('/api/admin/users/admin123');

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('you cannot delete your own account');
    });

    // TEST 3: User not found
    it('should return 404 when user does not exist', async () => {
        adminService.deleteUser.mockRejectedValue(new Error('user not found'));

        const response = await request(app)
            .delete('/api/admin/users/nonexistent123');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('user not found');
    });

    // TEST 4: Database error
    it('should return 500 when database error occurs', async () => {
        adminService.deleteUser.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .delete('/api/admin/users/user123');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });

});
