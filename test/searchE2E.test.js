const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const searchRoutes = require('../routes/searchRoutes');
const Listings = require('../models/listings');

let mongoServer;
let app;

describe('Search E2E Tests', () => {

    // Setup before all tests
    beforeAll(async () => {
        // Start in-memory MongoDB
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri);

        // Setup Express app
        app = express();
        app.use(express.json());
        app.use('/api', searchRoutes);
    });

    // Cleanup after all tests
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    // Clear database between tests
    beforeEach(async () => {
        await Listings.deleteMany({});
    });

    describe('Real Database Search Tests', () => {

        // TEST 1: Search by postal code with real data
        it('should find listings by postal code', async () => {
            // Arrange - Insert test data
            await Listings.create([
                {
                    title: 'Villa i Næstved',
                    description: 'Flot villa',
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
                    status: 'active'
                },
                {
                    title: 'Lejlighed i København',
                    description: 'Central lejlighed',
                    buildingType: 'Ejerlejlighed',
                    location: {
                        city: 'København',
                        postalCode: 2100,
                        address: 'Nørrebrogade 1',
                        coordinates: {
                            type: 'Point',
                            coordinates: [12.5561, 55.6918]
                        }
                    },
                    price: {
                        purchasePrice: 3000000,
                        monthlyOwnershipCost: 6000,
                        downPayment: 300000,
                        brutto: 10000,
                        netto: 9000
                    },
                    rooms: 3,
                    squareMeters: 80,
                    buildYear: 2010,
                    floors: 1,
                    energyRating: 'B',
                    status: 'active'
                }
            ]);

            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: '4700' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.listings[0].location.postalCode).toBe(4700);
            expect(response.body.listings[0].location.city).toBe('Næstved');
        });

        // TEST 2: Search by city name
        it('should find listings by city name', async () => {
            // Arrange
            await Listings.create({
                title: 'Lejlighed i København',
                description: 'Central lejlighed',
                buildingType: 'Ejerlejlighed',
                location: {
                    city: 'København',
                    postalCode: 2100,
                    address: 'Nørrebrogade 1',
                    coordinates: {
                        type: 'Point',
                        coordinates: [12.5561, 55.6918]
                    }
                },
                price: {
                    purchasePrice: 3000000,
                    monthlyOwnershipCost: 6000,
                    downPayment: 300000,
                    brutto: 10000,
                    netto: 9000
                },
                rooms: 3,
                squareMeters: 80,
                buildYear: 2010,
                floors: 1,
                energyRating: 'B',
                status: 'active'
            });

            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: 'København' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.listings[0].location.city).toBe('København');
        });

        // TEST 3: Search by address
        it('should find listings by address', async () => {
            // Arrange
            await Listings.create({
                title: 'Villa på Sjællandsvej',
                description: 'Flot villa',
                buildingType: 'Villa',
                location: {
                    city: 'Næstved',
                    postalCode: 4700,
                    address: 'Sjællandsvej 7',
                    coordinates: {
                        type: 'Point',
                        coordinates: [11.7611, 55.2297]
                    }
                },
                price: {
                    purchasePrice: 2500000,
                    monthlyOwnershipCost: 5500,
                    downPayment: 250000,
                    brutto: 9000,
                    netto: 8000
                },
                rooms: 6,
                squareMeters: 180,
                buildYear: 1990,
                floors: 2,
                energyRating: 'C',
                status: 'active'
            });

            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: 'Sjællandsvej' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.listings[0].location.address).toContain('Sjællandsvej');
        });

        // TEST 4: Only return active listings
        it('should only return active listings, not underReview or sold', async () => {
            // Arrange - Create listings with different statuses
            await Listings.create([
                {
                    title: 'Active Villa',
                    description: 'Test',
                    buildingType: 'Villa',
                    location: {
                        city: 'Næstved',
                        postalCode: 4700,
                        address: 'Testvej 1',
                        coordinates: { type: 'Point', coordinates: [11.7611, 55.2297] }
                    },
                    price: { purchasePrice: 2000000, monthlyOwnershipCost: 5000, downPayment: 200000, brutto: 8000, netto: 7000 },
                    rooms: 5,
                    squareMeters: 150,
                    buildYear: 1980,
                    floors: 2,
                    energyRating: 'C',
                    status: 'active'
                },
                {
                    title: 'Under Review Villa',
                    description: 'Test',
                    buildingType: 'Villa',
                    location: {
                        city: 'Næstved',
                        postalCode: 4700,
                        address: 'Testvej 2',
                        coordinates: { type: 'Point', coordinates: [11.7611, 55.2297] }
                    },
                    price: { purchasePrice: 2000000, monthlyOwnershipCost: 5000, downPayment: 200000, brutto: 8000, netto: 7000 },
                    rooms: 5,
                    squareMeters: 150,
                    buildYear: 1980,
                    floors: 2,
                    energyRating: 'C',
                    status: 'underReview'
                },
                {
                    title: 'Sold Villa',
                    description: 'Test',
                    buildingType: 'Villa',
                    location: {
                        city: 'Næstved',
                        postalCode: 4700,
                        address: 'Testvej 3',
                        coordinates: { type: 'Point', coordinates: [11.7611, 55.2297] }
                    },
                    price: { purchasePrice: 2000000, monthlyOwnershipCost: 5000, downPayment: 200000, brutto: 8000, netto: 7000 },
                    rooms: 5,
                    squareMeters: 150,
                    buildYear: 1980,
                    floors: 2,
                    energyRating: 'C',
                    status: 'sold'
                }
            ]);

            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: '4700' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1); // Only active listing
            expect(response.body.listings[0].status).toBe('active');
            expect(response.body.listings[0].title).toBe('Active Villa');
        });

        // TEST 5: Case-insensitive search
        it('should perform case-insensitive search', async () => {
            // Arrange
            await Listings.create({
                title: 'Villa i Aarhus',
                description: 'Test',
                buildingType: 'Villa',
                location: {
                    city: 'Aarhus',
                    postalCode: 8000,
                    address: 'Testvej 1',
                    coordinates: { type: 'Point', coordinates: [10.2039, 56.1629] }
                },
                price: { purchasePrice: 2000000, monthlyOwnershipCost: 5000, downPayment: 200000, brutto: 8000, netto: 7000 },
                rooms: 5,
                squareMeters: 150,
                buildYear: 1980,
                floors: 2,
                energyRating: 'C',
                status: 'active'
            });

            // Act - Search with different cases
            const response1 = await request(app).get('/api/search/listings').query({ query: 'aarhus' });
            const response2 = await request(app).get('/api/search/listings').query({ query: 'AARHUS' });
            const response3 = await request(app).get('/api/search/listings').query({ query: 'AaRhUs' });

            // Assert
            expect(response1.status).toBe(200);
            expect(response1.body.count).toBe(1);
            expect(response2.body.count).toBe(1);
            expect(response3.body.count).toBe(1);
        });

        // TEST 6: Result limit
        it('should limit results to 50', async () => {
            // Arrange - Create 60 listings
            const listings = [];
            for (let i = 0; i < 60; i++) {
                listings.push({
                    title: `Villa ${i}`,
                    description: 'Test',
                    buildingType: 'Villa',
                    location: {
                        city: 'Næstved',
                        postalCode: 4700,
                        address: `Testvej ${i}`,
                        coordinates: { type: 'Point', coordinates: [11.7611, 55.2297] }
                    },
                    price: { purchasePrice: 2000000, monthlyOwnershipCost: 5000, downPayment: 200000, brutto: 8000, netto: 7000 },
                    rooms: 5,
                    squareMeters: 150,
                    buildYear: 1980,
                    floors: 2,
                    energyRating: 'C',
                    status: 'active'
                });
            }
            await Listings.create(listings);

            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: '4700' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(50); // Limited to 50
            expect(response.body.listings).toHaveLength(50);
        });

        // TEST 7: Sort by newest first
        it('should return newest listings first', async () => {
            // Arrange - Create listings with delays
            const listing1 = await Listings.create({
                title: 'Old Villa',
                description: 'Test',
                buildingType: 'Villa',
                location: {
                    city: 'Næstved',
                    postalCode: 4700,
                    address: 'Testvej 1',
                    coordinates: { type: 'Point', coordinates: [11.7611, 55.2297] }
                },
                price: { purchasePrice: 2000000, monthlyOwnershipCost: 5000, downPayment: 200000, brutto: 8000, netto: 7000 },
                rooms: 5,
                squareMeters: 150,
                buildYear: 1980,
                floors: 2,
                energyRating: 'C',
                status: 'active'
            });

            // Wait a bit
            await new Promise(resolve => setTimeout(resolve, 100));

            const listing2 = await Listings.create({
                title: 'New Villa',
                description: 'Test',
                buildingType: 'Villa',
                location: {
                    city: 'Næstved',
                    postalCode: 4700,
                    address: 'Testvej 2',
                    coordinates: { type: 'Point', coordinates: [11.7611, 55.2297] }
                },
                price: { purchasePrice: 2000000, monthlyOwnershipCost: 5000, downPayment: 200000, brutto: 8000, netto: 7000 },
                rooms: 5,
                squareMeters: 150,
                buildYear: 1980,
                floors: 2,
                energyRating: 'C',
                status: 'active'
            });

            // Act
            const response = await request(app)
                .get('/api/search/listings')
                .query({ query: '4700' });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.listings[0].title).toBe('New Villa');
            expect(response.body.listings[1].title).toBe('Old Villa');
        });

    });

});