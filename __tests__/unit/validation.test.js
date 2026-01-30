import { jest } from '@jest/globals';
import {
  validateProjectName,
  checkDirectoryExists,
  sanitizeProjectName,
  suggestProjectName,
  validateFolderStructure,
} from '../../src/utils/validation.js';
import fs from 'fs-extra';
import path from 'path';
import { createTempDir, cleanupTempDir } from '../helpers.js';

describe('Validation Utils', () => {
  describe('validateProjectName', () => {
    test('should validate correct project names', () => {
      const validNames = [
        'my-project',
        'my-awesome-app',
        'test123',
        'a-b-c',
        'project_name',
      ];

      validNames.forEach((name) => {
        const result = validateProjectName(name);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    test('should reject empty or null names', () => {
      const result1 = validateProjectName('');
      expect(result1.valid).toBe(false);
      expect(result1.errors).toContain('Project name is required');

      const result2 = validateProjectName(null);
      expect(result2.valid).toBe(false);
    });

    test('should reject names with spaces', () => {
      const result = validateProjectName('my project');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('spaces'))).toBe(true);
    });

    test('should reject names with uppercase letters', () => {
      const result = validateProjectName('MyProject');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('lowercase'))).toBe(true);
    });

    test('should reject names starting with dot or underscore', () => {
      const result1 = validateProjectName('.my-project');
      expect(result1.valid).toBe(false);

      const result2 = validateProjectName('_my-project');
      expect(result2.valid).toBe(false);
    });

    test('should reject names with invalid characters', () => {
      const invalidNames = [
        'my@project',
        'my!project',
        'my(project)',
        'my~project',
      ];

      invalidNames.forEach((name) => {
        const result = validateProjectName(name);
        expect(result.valid).toBe(false);
      });
    });

    test('should reject names longer than 214 characters', () => {
      const longName = 'a'.repeat(215);
      const result = validateProjectName(longName);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('214'))).toBe(true);
    });
  });

  describe('checkDirectoryExists', () => {
    let tempDir;

    beforeEach(() => {
      tempDir = createTempDir('validation-test');
    });

    afterEach(() => {
      cleanupTempDir(tempDir);
    });

    test('should detect existing directory', () => {
      const testDir = path.join(tempDir, 'existing-dir');
      fs.ensureDirSync(testDir);

      const result = checkDirectoryExists('existing-dir', tempDir);
      expect(result.exists).toBe(true);
      expect(result.path).toBe(testDir);
    });

    test('should detect non-existing directory', () => {
      const result = checkDirectoryExists('non-existing-dir', tempDir);
      expect(result.exists).toBe(false);
    });

    test('should use current directory as base path by default', () => {
      const result = checkDirectoryExists('test-dir');
      expect(result.path).toContain('test-dir');
    });
  });

  describe('sanitizeProjectName', () => {
    test('should convert to lowercase', () => {
      expect(sanitizeProjectName('MyProject')).toBe('myproject');
    });

    test('should replace spaces with hyphens', () => {
      expect(sanitizeProjectName('my project')).toBe('my-project');
      expect(sanitizeProjectName('my  project  name')).toBe('my-project-name');
    });

    test('should remove invalid characters', () => {
      expect(sanitizeProjectName('my@project!')).toBe('myproject');
      expect(sanitizeProjectName('my~project()')).toBe('myproject');
    });

    test('should remove leading dots and underscores', () => {
      expect(sanitizeProjectName('.my-project')).toBe('my-project');
      expect(sanitizeProjectName('_my-project')).toBe('my-project');
    });

    test('should limit length to 214 characters', () => {
      const longName = 'a'.repeat(300);
      const result = sanitizeProjectName(longName);
      expect(result.length).toBe(214);
    });

    test('should handle empty strings', () => {
      expect(sanitizeProjectName('')).toBe('');
      expect(sanitizeProjectName('   ')).toBe('');
    });
  });

  describe('suggestProjectName', () => {
    test('should sanitize invalid names', () => {
      expect(suggestProjectName('My Project')).toBe('my-project');
      expect(suggestProjectName('My@Project!')).toBe('myproject');
    });

    test('should return default name for empty input', () => {
      expect(suggestProjectName('')).toBe('my-awesome-project');
      expect(suggestProjectName('!!!')).toBe('my-awesome-project');
    });

    test('should preserve valid names', () => {
      expect(suggestProjectName('my-project')).toBe('my-project');
    });
  });

  describe('validateFolderStructure', () => {
    test('should validate correct folder structures', () => {
      const validStructures = [
        'feature-based',
        'type-based',
        'domain-driven',
        'flat',
      ];

      validStructures.forEach((structure) => {
        expect(validateFolderStructure(structure)).toBe(true);
      });
    });

    test('should reject invalid folder structures', () => {
      expect(validateFolderStructure('invalid-structure')).toBe(false);
      expect(validateFolderStructure('random')).toBe(false);
      expect(validateFolderStructure('')).toBe(false);
    });
  });
});
