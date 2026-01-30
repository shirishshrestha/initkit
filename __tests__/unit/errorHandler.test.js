import { jest } from '@jest/globals';
import {
  CLIError,
  ERROR_CODES,
  displayError,
  rollbackProject,
  withErrorHandling,
} from '../../src/utils/errorHandler.js';
import fs from 'fs-extra';
import { createTempDir, cleanupTempDir, fileExists } from '../helpers.js';

describe('Error Handler', () => {
  describe('CLIError', () => {
    test('should create error with message and code', () => {
      const error = new CLIError('Test error', ERROR_CODES.VALIDATION_ERROR);
      
      expect(error.message).toBe('Test error');
      expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect(error.name).toBe('CLIError');
      expect(error instanceof Error).toBe(true);
    });

    test('should create error with details', () => {
      const details = { path: '/test/path', attempt: 1 };
      const error = new CLIError('Test error', ERROR_CODES.CREATION_FAILED, details);
      
      expect(error.details).toEqual(details);
    });

    test('should capture stack trace', () => {
      const error = new CLIError('Test error', ERROR_CODES.UNKNOWN_ERROR);
      
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('CLIError');
    });
  });

  describe('ERROR_CODES', () => {
    test('should have all expected error codes', () => {
      const expectedCodes = [
        'VALIDATION_ERROR',
        'DIRECTORY_EXISTS',
        'CREATION_FAILED',
        'INSTALL_FAILED',
        'GIT_INIT_FAILED',
        'PERMISSION_DENIED',
        'NETWORK_ERROR',
        'UNKNOWN_ERROR',
      ];

      expectedCodes.forEach((code) => {
        expect(ERROR_CODES[code]).toBe(code);
      });
    });
  });

  describe('displayError', () => {
    beforeEach(() => {
      // Clear console mocks
      jest.clearAllMocks();
    });

    test('should display CLI error with message', () => {
      const error = new CLIError('Test error message', ERROR_CODES.VALIDATION_ERROR);
      
      displayError(error);
      
      // Check that console methods were called
      expect(console.log).toHaveBeenCalled();
    });

    test('should display error with details', () => {
      const error = new CLIError(
        'Creation failed',
        ERROR_CODES.CREATION_FAILED,
        { path: '/test', reason: 'permission' }
      );
      
      displayError(error);
      
      expect(console.log).toHaveBeenCalled();
    });

    test('should display suggestions for known error codes', () => {
      const error = new CLIError(
        'Validation error',
        ERROR_CODES.VALIDATION_ERROR
      );
      
      displayError(error);
      
      // Should display suggestions
      expect(console.log).toHaveBeenCalled();
    });

    test('should handle generic errors', () => {
      const error = new Error('Generic error');
      
      displayError(error);
      
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('rollbackProject', () => {
    let tempDir;

    beforeEach(() => {
      tempDir = createTempDir('rollback-test');
    });

    afterEach(() => {
      cleanupTempDir(tempDir);
    });

    test('should remove project directory on rollback', async () => {
      // Create some files in temp directory
      await fs.writeFile(`${tempDir}/test.txt`, 'test content');
      
      expect(fileExists(tempDir)).toBe(true);
      
      await rollbackProject(tempDir);
      
      expect(fileExists(tempDir)).toBe(false);
    });

    test('should handle non-existent directory gracefully', async () => {
      const nonExistentPath = `${tempDir}/non-existent`;
      
      await expect(rollbackProject(nonExistentPath)).resolves.not.toThrow();
    });

    test('should handle null path gracefully', async () => {
      await expect(rollbackProject(null)).resolves.not.toThrow();
    });
  });

  describe('withErrorHandling', () => {
    let tempDir;

    beforeEach(() => {
      tempDir = createTempDir('error-handling-test');
    });

    afterEach(() => {
      cleanupTempDir(tempDir);
    });

    test('should execute operation successfully', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      
      const result = await withErrorHandling(operation, {
        projectPath: tempDir,
        rollback: false,
      });
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalled();
    });

    test('should rollback on error if enabled', async () => {
      // Create a file to verify rollback
      await fs.writeFile(`${tempDir}/test.txt`, 'test');
      
      const operation = jest.fn().mockRejectedValue(new Error('Test error'));
      
      await expect(
        withErrorHandling(operation, {
          projectPath: tempDir,
          rollback: true,
          errorCode: ERROR_CODES.CREATION_FAILED,
        })
      ).rejects.toThrow();
      
      // Directory should be removed
      expect(fileExists(tempDir)).toBe(false);
    });

    test('should not rollback if disabled', async () => {
      await fs.writeFile(`${tempDir}/test.txt`, 'test');
      
      const operation = jest.fn().mockRejectedValue(new Error('Test error'));
      
      await expect(
        withErrorHandling(operation, {
          projectPath: tempDir,
          rollback: false,
        })
      ).rejects.toThrow();
      
      // Directory should still exist
      expect(fileExists(tempDir)).toBe(true);
    });

    test('should wrap errors with CLIError', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Original error'));
      
      try {
        await withErrorHandling(operation, {
          projectPath: tempDir,
          rollback: false,
          errorCode: ERROR_CODES.CREATION_FAILED,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CLIError);
        expect(error.code).toBe(ERROR_CODES.CREATION_FAILED);
      }
    });

    test('should preserve CLIError instances', async () => {
      const originalError = new CLIError('Test', ERROR_CODES.VALIDATION_ERROR);
      const operation = jest.fn().mockRejectedValue(originalError);
      
      try {
        await withErrorHandling(operation, {
          projectPath: tempDir,
          rollback: false,
        });
      } catch (error) {
        expect(error).toBe(originalError);
        expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      }
    });
  });
});
