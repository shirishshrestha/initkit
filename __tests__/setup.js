// Test setup and global mocks
import { jest } from '@jest/globals';

// Mock console methods to reduce noise during testing
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.CI = 'true';

// Increase timeout for slower operations
jest.setTimeout(10000);
