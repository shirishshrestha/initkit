import { jest } from '@jest/globals';
import { generateTemplate } from '../../src/utils/templateGenerator.js';
import {
  createTempDir,
  cleanupTempDir,
  fileExists,
  readFile,
  dirExists,
  mockAnswers,
} from '../helpers.js';

describe('Template Generator', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = createTempDir('template-test');
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('generateTemplate', () => {
    test('should generate frontend React template', async () => {
      const config = {
        ...mockAnswers.frontend,
      };

      await generateTemplate(tempDir, config);

      // Verify basic structure
      expect(dirExists(`${tempDir}/src`)).toBe(true);
      expect(fileExists(`${tempDir}/package.json`)).toBe(true);
      expect(fileExists(`${tempDir}/README.md`)).toBe(true);
    });

    test.skip('should generate backend Express template', async () => {
      const config = {
        ...mockAnswers.backend,
      };

      await generateTemplate(tempDir, config);

      expect(dirExists(`${tempDir}/src`)).toBe(true);
      expect(fileExists(`${tempDir}/package.json`)).toBe(true);
    });

    test.skip('should generate full-stack monorepo template', async () => {
      const config = {
        ...mockAnswers.fullstack,
      };

      await generateTemplate(tempDir, config);

      // Verify monorepo structure
      expect(dirExists(`${tempDir}/apps`)).toBe(true);
      expect(dirExists(`${tempDir}/packages`)).toBe(true);
      expect(fileExists(`${tempDir}/turbo.json`)).toBe(true);
      expect(fileExists(`${tempDir}/package.json`)).toBe(true);
    });

    test.skip('should generate Next.js template', async () => {
      const config = {
        ...mockAnswers.nextjs,
      };

      await generateTemplate(tempDir, config);

      expect(dirExists(`${tempDir}/src/app`)).toBe(true);
      expect(fileExists(`${tempDir}/package.json`)).toBe(true);
    });

    test.skip('should create .gitignore file', async () => {
      const config = {
        ...mockAnswers.frontend,
      };

      await generateTemplate(tempDir, config);

      expect(fileExists(`${tempDir}/.gitignore`)).toBe(true);

      const content = readFile(`${tempDir}/.gitignore`);
      expect(content).toContain('node_modules');
    });

    test.skip('should replace project name in templates', async () => {
      const projectName = 'my-custom-app';
      const config = {
        ...mockAnswers.frontend,
        projectName,
      };

      await generateTemplate(tempDir, config);

      const packageJson = JSON.parse(readFile(`${tempDir}/package.json`));
      expect(packageJson.name).toBe(projectName);
    });

    test.skip('should include project name in README', async () => {
      const projectName = 'my-test-project';
      const config = {
        ...mockAnswers.frontend,
        projectName,
      };

      await generateTemplate(tempDir, config);

      const readme = readFile(`${tempDir}/README.md`);
      expect(readme).toContain(projectName);
    });
  });
});
