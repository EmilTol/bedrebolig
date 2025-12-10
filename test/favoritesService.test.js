const listingService = require('../services/listingsService');
const Listings = require('../models/listings');
const Users = require('../models/users');

// Mock Mongoose models så vi ikke rammer den rigtige database
jest.mock('../models/listings');
jest.mock('../models/users');

describe('FavoritesService - Unit Tests', () => {

    beforeEach(() => {
        // Ryd alle mocks før hver test så de ikke påvirker hinanden
        jest.clearAllMocks();
    });

    describe('toggleFavorite', () => {

        it('should add user to favoritedBy when not already favorited', async () => {
            // Arrange - Setup test data
            const listingId = 'listing123';
            const userId = 'user456';
            const mockListing = {
                _id: listingId,
                title: 'Test Villa',
                favoritedBy: [userId] // Efter tilføjelse indeholder den userId
            };

            // Mock første findOneAndUpdate query til at returnere listing (betyder brugeren blev tilføjet)
            // Andet kald skal returnere null (for at simulere at første query lykkedes)
            Listings.findOneAndUpdate = jest.fn()
                .mockResolvedValueOnce(mockListing) // Første kald: tilføj til favoritter lykkes
                .mockResolvedValueOnce(null);       // Andet kald: køres ikke da første lykkedes

            // Act - Kør funktionen vi tester
            const result = await listingService.toggleFavorite(listingId, userId);

            // Assert - Tjek at funktionen gjorde det rigtige
            // Verificer at den kaldte findOneAndUpdate med korrekte parametre for at TILFØJE favorit
            expect(Listings.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: listingId, favoritedBy: { $ne: userId } }, // Find listing hvor user IKKE er i favoritter
                { $push: { favoritedBy: userId } },                // Tilføj user til favoritter
                { new: true }                                      // Returner opdateret dokument
            );
            expect(result.favorited).toBe(true);
            expect(result.message).toBe("Bolig blev tilføjet til favoritter");
            expect(result.listing).toEqual(mockListing);
        });

        it('should remove user from favoritedBy when already favorited', async () => {
            // Arrange - Setup test data
            const listingId = 'listing123';
            const userId = 'user456';
            const mockListing = {
                _id: listingId,
                title: 'Test Villa',
                favoritedBy: [] // Efter fjernelse er favoritter tom
            };

            // Mock første query fejler (returnerer null = bruger allerede har favorit)
            // Anden query lykkes (returnerer listing = bruger blev fjernet fra favoritter)
            Listings.findOneAndUpdate = jest.fn()
                .mockResolvedValueOnce(null)        // Første kald: tilføj fejler (bruger allerede favorit)
                .mockResolvedValueOnce(mockListing); // Andet kald: fjern fra favoritter lykkes

            // Act - Kør funktionen vi tester
            const result = await listingService.toggleFavorite(listingId, userId);

            // Assert - Tjek at funktionen gjorde det rigtige
            expect(Listings.findOneAndUpdate).toHaveBeenCalledTimes(2); // Skal kalde 2 gange
            // Verificer at andet kald var for at FJERNE favorit
            expect(Listings.findOneAndUpdate).toHaveBeenNthCalledWith(2,
                { _id: listingId, favoritedBy: userId }, // Find listing hvor user ER i favoritter
                { $pull: { favoritedBy: userId } },       // Fjern user fra favoritter
                { new: true }                             // Returner opdateret dokument
            );
            expect(result.favorited).toBe(false);
            expect(result.message).toBe("Bolig fjernet fra favoritter");
            expect(result.listing).toEqual(mockListing);
        });

        it('should return null when listing does not exist', async () => {
            // Arrange - Setup test data
            const listingId = 'nonexistent';
            const userId = 'user456';

            // Mock begge queries til at returnere null (listing findes ikke)
            Listings.findOneAndUpdate = jest.fn()
                .mockResolvedValueOnce(null) // Første forsøg: tilføj favorit fejler
                .mockResolvedValueOnce(null); // Andet forsøg: fjern favorit fejler

            // Act - Kør funktionen vi tester
            const result = await listingService.toggleFavorite(listingId, userId);

            // Assert - Tjek at funktionen returnerer null når listing ikke findes
            expect(result).toBeNull();
        });

    });

    describe('getUserFavourites', () => {

        it('should return all listings favorited by user', async () => {
            // Arrange - Setup test data
            const userId = 'user123';
            const mockUser = { _id: userId, name: 'Test User' };
            const mockListings = [
                { _id: '1', title: 'Villa 1', favoritedBy: [userId] },
                { _id: '2', title: 'Villa 2', favoritedBy: [userId] }
            ];

            // Mock at bruger findes og har 2 favoritter
            Users.findById.mockResolvedValue(mockUser);
            Listings.find.mockResolvedValue(mockListings);

            // Act - Kør funktionen vi tester
            const result = await listingService.getUserFavourites(userId);

            // Assert - Tjek at funktionen hentede korrekte data
            expect(Users.findById).toHaveBeenCalledWith(userId); // Verificer bruger blev tjekket
            expect(Listings.find).toHaveBeenCalledWith({ favoritedBy: userId }); // Verificer korrekt query
            expect(result).toEqual(mockListings);
            expect(result).toHaveLength(2); // Bruger har 2 favoritter
        });

        it('should throw error when user not found', async () => {
            // Arrange - Setup test data
            const userId = 'nonexistent';
            Users.findById.mockResolvedValue(null); // Mock at bruger ikke findes

            // Act & Assert - Kør funktionen og forvent den kaster en fejl
            await expect(listingService.getUserFavourites(userId))
                .rejects
                .toThrow('User not found');
        });

        it('should return empty array when user has no favorites', async () => {
            // Arrange - Setup test data
            const userId = 'user123';
            const mockUser = { _id: userId, name: 'Test User' };

            // Mock at bruger findes men har ingen favoritter
            Users.findById.mockResolvedValue(mockUser);
            Listings.find.mockResolvedValue([]); // Tom array = ingen favoritter

            // Act - Kør funktionen vi tester
            const result = await listingService.getUserFavourites(userId);

            // Assert - Tjek at funktionen returnerer tom array
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

    });

});
