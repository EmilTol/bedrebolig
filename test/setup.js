
// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.JWT_EXPIRES = '86400';

// Increase timeout for database operations
jest.setTimeout(30000);


// Global test utilities
global.createMockListing = (overrides = {}) => {
    return {
        title: 'Test Villa',
        description: 'Test description',
        buildingType: 'Villa',
        location: {
            city: 'Næstved',
            postalCode: 4700,
            address: 'Testvej 1',
            coordinates: {
                type: 'Point',
                coordinates: [11.7611, 55.2297]
            }
        },
        price: {
            purchasePrice: 2000000,
            monthlyOwnershipCost: 5000,
            downPayment: 200000,
            brutto: 8000,
            netto: 7000
        },
        rooms: 5,
        squareMeters: 150,
        buildYear: 1980,
        floors: 2,
        energyRating: 'C',
        status: 'active',
        ...overrides
    };
}

