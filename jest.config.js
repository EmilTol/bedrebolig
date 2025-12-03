module.exports = {
    // Test environment
    testEnvironment: 'node',

    // Test match patterns
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ],

    // Coverage settings
    // I jest.config.js, ændre collectCoverageFrom til:
    collectCoverageFrom: [
        'controllers/searchController.js',
        'services/searchService.js',
        'routes/searchRoutes.js',
        '!**/node_modules/**',
        '!**/test/**'
    ],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],

    // Ignore patterns
    testPathIgnorePatterns: [
        '/node_modules/',
        '/public/'
    ],

    // Verbose output
    verbose: true,

    // Automatically clear mock calls between tests
    clearMocks: true,

    // Force coverage collection
    forceCoverageMatch: [
        '**/*.js'
    ],

    // Test timeout (30 seconds for E2E tests)
    testTimeout: 30000
};