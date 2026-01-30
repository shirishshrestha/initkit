export default {
  // Use node test environment
  testEnvironment: 'node',
  
  // Transform configuration
  transform: {},
  
  // Module name mapper for ES modules
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js',
    '!src/cli.js',
    '!src/commands/**',
    '!**/node_modules/**',
  ],

  coverageThreshold: {
    global: {
      branches: 34,
      functions: 45,
      lines: 40,
      statements: 40,
    },
  },

  // Coverage directory
  coverageDirectory: 'coverage',

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],

  // Test timeout
  testTimeout: 10000,

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test-output/',
    '/coverage/',
  ],
};
