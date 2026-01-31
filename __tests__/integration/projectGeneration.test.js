import { jest } from '@jest/globals';
import { generateTemplate } from '../../src/utils/templateGenerator.js';
import {
  createTempDir,
  cleanupTempDir,
  fileExists,
  dirExists,
  getAllFiles,
  readFile,
  mockAnswers,
} from '../helpers.js';

describe('Integration Tests - Complete Project Generation', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = createTempDir('integration-test');
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('Next.js Project Generation', () => {
    test('should generate Next.js project structure', async () => {
      const config = {
        ...mockAnswers.nextjs,
      };

      await generateTemplate(tempDir, config);

      // Verify directory structure
      expect(dirExists(`${tempDir}/src`)).toBe(true);
      expect(dirExists(`${tempDir}/src/app`)).toBe(true);

      // Verify configuration files
      expect(fileExists(`${tempDir}/package.json`)).toBe(true);
      expect(fileExists(`${tempDir}/README.md`)).toBe(true);

      // Verify .gitignore
      expect(fileExists(`${tempDir}/.gitignore`)).toBe(true);
      const gitignore = readFile(`${tempDir}/.gitignore`);
      expect(gitignore).toContain('node_modules');
      expect(gitignore).toContain('.next');
    });
  });

  describe('Express Backend Generation', () => {
    test.skip('should generate Express API structure', async () => {
      const config = {
        ...mockAnswers.backend,
      };

      await generateTemplate(tempDir, config);

      // Verify directory structure
      expect(dirExists(`${tempDir}/src`)).toBe(true);

      // Verify configuration files
      expect(fileExists(`${tempDir}/package.json`)).toBe(true);
      expect(fileExists(`${tempDir}/README.md`)).toBe(true);

      // Verify package.json content
      const packageJson = JSON.parse(readFile(`${tempDir}/package.json`));
      expect(packageJson.name).toBe('test-backend');
    });
  });

  describe('Full-Stack Monorepo Generation', () => {
    test.skip('should generate monorepo structure', async () => {
      const config = {
        ...mockAnswers.fullstack,
      };

      await generateTemplate(tempDir, config);

      // Verify monorepo structure
      expect(dirExists(`${tempDir}/apps`)).toBe(true);
      expect(dirExists(`${tempDir}/packages`)).toBe(true);

      // Verify Turborepo configuration
      expect(fileExists(`${tempDir}/turbo.json`)).toBe(true);
      expect(fileExists(`${tempDir}/package.json`)).toBe(true);

      // Verify root package.json
      const packageJson = JSON.parse(readFile(`${tempDir}/package.json`));
      expect(packageJson.name).toBe('test-fullstack');

      // Count files to ensure structure is complete
      const allFiles = getAllFiles(tempDir);
      expect(allFiles.length).toBeGreaterThan(10);
    });
  });

  describe('React SPA Generation', () => {
    test.skip('should generate React app structure', async () => {
      const config = {
        ...mockAnswers.frontend,
      };

      await generateTemplate(tempDir, config);

      // Verify structure
      expect(dirExists(`${tempDir}/src`)).toBe(true);

      // Verify configuration
      expect(fileExists(`${tempDir}/package.json`)).toBe(true);
      expect(fileExists(`${tempDir}/README.md`)).toBe(true);

      // Verify package.json
      const packageJson = JSON.parse(readFile(`${tempDir}/package.json`));
      expect(packageJson.name).toBe('test-frontend');
    });
  });

  describe('Cross-Platform Compatibility', () => {
    test.skip('should handle various path formats', async () => {
      const config = {
        ...mockAnswers.frontend,
      };

      await generateTemplate(tempDir, config);

      expect(fileExists(`${tempDir}/package.json`)).toBe(true);

      const packageJsonContent = readFile(`${tempDir}/package.json`);
      expect(packageJsonContent).toBeTruthy();
      expect(packageJsonContent.includes('{')).toBe(true);
    });
  });
});
