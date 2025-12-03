const request = require('supertest');
const express = require('express');
const searchRoutes = require('../routes/searchRoutes');
const Listings = require('../models/listings');

// Mock the Listings model
jest.mock('../models/listings');

// Create test app
const app = express();
app.use(express.json());
app.use('/api', searchRoutes);

describe('Search Controller - Integration Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/search/listings', () => {

        // TEST 1: Successful search with postal code
        it('should return 200 and listings for valid postal code search', async () => {
            // Arrange
            const mockListings = [
                {
                    _id: '1',
                    title: 'Villa i Næstved',
                    location: { postalCode: 4700, city: 'Næstved', address: 'Testvej 1' },
                    price: { purchasePrice: 2000000 },
                    status: 'active'
                }
            ];

            const mockFind = {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockListings)
            };
            Listings.find.mockReturnValue(mockFind);

            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: '4700' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('count', 1);
            expect(response.body).toHaveProperty('listings');
            expect(response.body.listings).toEqual(mockListings);
        });

        // TEST 2: Successful search with city name
        it('should return 200 and listings for valid city search', async () => {
            // Arrange
            const mockListings = [
                {
                    _id: '2',
                    title: 'Lejlighed i København',
                    location: { postalCode: 2100, city: 'København', address: 'Nørrebrogade 1' },
                    status: 'active'
                }
            ];

            const mockFind = {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockListings)
            };
            Listings.find.mockReturnValue(mockFind);

            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: 'København' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.listings[0].location.city).toBe('København');
        });

        // TEST 3: Empty results
        it('should return 200 with empty array when no listings found', async () => {
            // Arrange
            const mockFind = {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            };
            Listings.find.mockReturnValue(mockFind);

            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: 'xyz123' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(0);
            expect(response.body.listings).toEqual([]);
        });

        // TEST 4: Missing query parameter
        it('should return 400 when query parameter is missing', async () => {
            // Act
            const response = await request(app)
                .get('/api/search/listings');

            // Assert
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Søgeord er påkrævet');
        });

        // TEST 5: Empty query parameter
        it('should return 400 when query parameter is empty', async () => {
            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: '' });

            // Assert
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Søgeord er påkrævet');
        });

        // TEST 6: Whitespace only query
        it('should return 400 when query is only whitespace', async () => {
            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: '   ' });

            // Assert
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Søgeord er påkrævet');
        });

        // TEST 7: URL encoding handling
        it('should handle URL encoded search queries', async () => {
            // Arrange
            const mockFind = {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            };
            Listings.find.mockReturnValue(mockFind);

            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: 'Sjællandsvej' }); // Special Danish characters

            // Assert
            expect(response.status).toBe(200);
            expect(Listings.find).toHaveBeenCalled();
        });

        // TEST 8: Database error handling
        it('should return 500 when database error occurs', async () => {
            // Arrange
            const mockFind = {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockRejectedValue(new Error('Database error'))
            };
            Listings.find.mockReturnValue(mockFind);

            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: 'test' });

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });

        // TEST 9: Response structure validation
        it('should return correct response structure', async () => {
            // Arrange
            const mockListings = [{ _id: '1', title: 'Test' }];
            const mockFind = {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockListings)
            };
            Listings.find.mockReturnValue(mockFind);

            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: 'test' });

            // Assert
            expect(response.body).toHaveProperty('count');
            expect(response.body).toHaveProperty('listings');
            expect(typeof response.body.count).toBe('number');
            expect(Array.isArray(response.body.listings)).toBe(true);
        });

        // TEST 10: Case sensitivity
        it('should handle case-insensitive searches', async () => {
            // Arrange
            const mockListings = [
                {
                    _id: '1',
                    location: { city: 'København' }
                }
            ];
            const mockFind = {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockListings)
            };
            Listings.find.mockReturnValue(mockFind);

            // Act - Search with lowercase
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: 'københavn' });

            // Assert
            expect(response.status).toBe(200);
            expect(Listings.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    $or: expect.arrayContaining([
                        expect.objectContaining({
                            'location.city': expect.objectContaining({
                                $options: 'i'
                            })
                        })
                    ])
                })
            );
        });

    });

});