const searchService = require('../services/searchService');
const Listings = require('../models/listings');

// Mock Mongoose model
jest.mock('../models/listings');

describe('SearchService - Unit Tests', () => {

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('searchListings', () => {

        // TEST 1: Should detect postal code (numbers only)
        describe('Postal Code Search', () => {

            it('should search by postal code when query contains only numbers', async () => {
                // Arrange
                const query = '4700';
                const mockListings = [
                    {
                        _id: '1',
                        title: 'Villa i Næstved',
                        location: { postalCode: 4700, city: 'Næstved', address: 'Testvej 1' },
                        status: 'active'
                    }
                ];

                const mockFind = {
                    sort: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue(mockListings)
                };
                Listings.find.mockReturnValue(mockFind);

                // Act
                const result = await searchService.searchListings(query);

                // Assert
                expect(Listings.find).toHaveBeenCalledWith({
                    'location.postalCode': 4700,
                    status: 'active'
                });
                expect(result).toEqual(mockListings);
                expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
                expect(mockFind.limit).toHaveBeenCalledWith(50);
            });

            it('should convert postal code string to integer', async () => {
                // Arrange
                const query = '2100';
                const mockFind = {
                    sort: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue([])
                };
                Listings.find.mockReturnValue(mockFind);

                // Act
                await searchService.searchListings(query);

                // Assert
                expect(Listings.find).toHaveBeenCalledWith({
                    'location.postalCode': 2100, // Should be number, not string
                    status: 'active'
                });
            });

        });

        // TEST 2: Should search by address/city with regex
        describe('Text Search (Address/City)', () => {

            it('should search by address when query contains text', async () => {
                // Arrange
                const query = 'København';
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
                const result = await searchService.searchListings(query);

                // Assert
                expect(Listings.find).toHaveBeenCalledWith({
                    $or: [
                        { 'location.address': { $regex: 'København', $options: 'i' } },
                        { 'location.city': { $regex: 'København', $options: 'i' } }
                    ],
                    status: 'active'
                });
                expect(result).toEqual(mockListings);
            });

            it('should perform case-insensitive search', async () => {
                // Arrange
                const query = 'AARHUS'; // Uppercase
                const mockFind = {
                    sort: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue([])
                };
                Listings.find.mockReturnValue(mockFind);

                // Act
                await searchService.searchListings(query);

                // Assert
                const callArgs = Listings.find.mock.calls[0][0];
                expect(callArgs.$or[0]['location.address'].$options).toBe('i');
                expect(callArgs.$or[1]['location.city'].$options).toBe('i');
            });

            it('should search in both address and city fields', async () => {
                // Arrange
                const query = 'Sjællandsvej';
                const mockFind = {
                    sort: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue([])
                };
                Listings.find.mockReturnValue(mockFind);

                // Act
                await searchService.searchListings(query);

                // Assert
                const callArgs = Listings.find.mock.calls[0][0];
                expect(callArgs.$or).toHaveLength(2);
                expect(Object.keys(callArgs.$or[0])[0]).toBe('location.address');
                expect(Object.keys(callArgs.$or[1])[0]).toBe('location.city');
            });

        });

        // TEST 3: Should trim whitespace from query
        describe('Input Validation', () => {

            it('should trim whitespace from query', async () => {
                // Arrange
                const query = '  4700  ';
                const mockFind = {
                    sort: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue([])
                };
                Listings.find.mockReturnValue(mockFind);

                // Act
                await searchService.searchListings(query);

                // Assert
                expect(Listings.find).toHaveBeenCalledWith(
                    expect.objectContaining({
                        'location.postalCode': 4700 // Trimmed and converted
                    })
                );
            });

        });

        // TEST 4: Should only return active listings
        describe('Status Filtering', () => {

            it('should only search for active listings', async () => {
                // Arrange
                const query = 'København';
                const mockFind = {
                    sort: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue([])
                };
                Listings.find.mockReturnValue(mockFind);

                // Act
                await searchService.searchListings(query);

                // Assert
                const callArgs = Listings.find.mock.calls[0][0];
                expect(callArgs.status).toBe('active');
            });

        });

        // TEST 5: Should sort by newest first
        describe('Sorting', () => {

            it('should sort results by createdAt descending', async () => {
                // Arrange
                const query = 'test';
                const mockFind = {
                    sort: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue([])
                };
                Listings.find.mockReturnValue(mockFind);

                // Act
                await searchService.searchListings(query);

                // Assert
                expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
            });

        });

        // TEST 6: Should limit results
        describe('Result Limiting', () => {

            it('should limit results to 50', async () => {
                // Arrange
                const query = 'test';
                const mockFind = {
                    sort: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue([])
                };
                Listings.find.mockReturnValue(mockFind);

                // Act
                await searchService.searchListings(query);

                // Assert
                expect(mockFind.limit).toHaveBeenCalledWith(50);
            });

        });

        // TEST 7: Error handling
        describe('Error Handling', () => {

            it('should throw error when database query fails', async () => {
                // Arrange
                const query = 'test';
                const dbError = new Error('Database connection failed');

                const mockFind = {
                    sort: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockRejectedValue(dbError)
                };
                Listings.find.mockReturnValue(mockFind);

                // Act & Assert
                await expect(searchService.searchListings(query))
                    .rejects
                    .toThrow('Fejl ved søgning: Database connection failed');
            });

            it('should handle empty query gracefully', async () => {
                // Arrange
                const query = '';
                const mockFind = {
                    sort: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue([])
                };
                Listings.find.mockReturnValue(mockFind);

                // Act
                const result = await searchService.searchListings(query);

                // Assert
                expect(result).toEqual([]);
            });

        });

    });

});