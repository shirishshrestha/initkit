import { jest } from '@jest/globals';
import path from 'path';
import { createProject } from '../../src/commands/create.js';
import { execCommand } from '../../src/utils/cliRunner.js';
import { initGit } from '../../src/utils/git.js';
import { createTempDir, cleanupTempDir } from '../helpers.js';

// Mock external CLI commands
jest.mock('../../src/utils/cliRunner.js');
jest.mock('../../src/utils/git.js');

describe('CLI-First Workflow Integration Tests', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = createTempDir('cli-workflow-test');
    jest.clearAllMocks();
    execCommand.mockResolvedValue();
    initGit.mockResolvedValue();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('Next.js Project Creation Workflow', () => {
    test('should execute complete workflow for Next.js with addons', async () => {
      const answers = {
        projectName: 'test-nextjs',
        projectType: 'frontend',
        framework: 'nextjs',
        language: 'typescript',
        styling: 'tailwind',
        folderStructure: 'feature-based',
        packageManager: 'pnpm',
        useGit: true,
        stateManagement: 'zustand',
        uiLibrary: 'shadcn',
        orm: 'prisma',
        database: 'postgresql',
        authentication: 'nextauth',
        testing: ['vitest', 'playwright'],
      };

      await createProject(answers, tempDir);

      const allCalls = execCommand.mock.calls.map((call) => call[0]);

      // Step 1: Verify framework bootstrap with create-next-app
      const createNextAppCalls = allCalls.filter((cmd) => cmd.includes('create-next-app'));
      expect(createNextAppCalls.length).toBe(1);
      expect(createNextAppCalls[0]).toContain('--typescript');
      expect(createNextAppCalls[0]).toContain('--tailwind');
      expect(createNextAppCalls[0]).toContain('--use-pnpm');
      expect(createNextAppCalls[0]).toContain('--skip-install');
      expect(createNextAppCalls[0]).toContain('--no-git');

      // Step 2: Verify addons installation
      // State management
      expect(allCalls.some((cmd) => cmd.includes('zustand'))).toBe(true);

      // UI library (shadcn uses CLI)
      expect(allCalls.some((cmd) => cmd.includes('shadcn@latest init'))).toBe(true);

      // ORM (Prisma uses CLI)
      expect(allCalls.some((cmd) => cmd.includes('prisma init'))).toBe(true);
      expect(allCalls.some((cmd) => cmd.includes('--datasource-provider postgresql'))).toBe(true);

      // Authentication
      expect(allCalls.some((cmd) => cmd.includes('next-auth'))).toBe(true);

      // Testing (Playwright uses CLI)
      expect(allCalls.some((cmd) => cmd.includes('init playwright@latest'))).toBe(true);
      expect(allCalls.some((cmd) => cmd.includes('vitest'))).toBe(true);

      // Step 4: Verify dependencies installation
      const installCalls = allCalls.filter((cmd) => cmd === 'pnpm install');
      expect(installCalls.length).toBeGreaterThan(0);

      // Step 5: Verify git initialization
      expect(initGit).toHaveBeenCalledWith(path.join(tempDir, 'test-nextjs'));
    });

    test('should handle npm package manager correctly', async () => {
      const answers = {
        projectName: 'test-npm-app',
        projectType: 'frontend',
        framework: 'nextjs',
        language: 'typescript',
        styling: 'tailwind',
        folderStructure: 'component-based',
        packageManager: 'npm',
        useGit: false,
        stateManagement: 'redux-toolkit',
      };

      await createProject(answers, tempDir);

      const allCalls = execCommand.mock.calls.map((call) => call[0]);

      // Verify npm flag for create-next-app
      expect(allCalls.some((cmd) => cmd.includes('--use-npm'))).toBe(true);

      // Verify npm install command
      expect(allCalls.some((cmd) => cmd === 'npm install')).toBe(true);

      // Verify Redux Toolkit installed with npm
      expect(allCalls.some((cmd) => cmd.includes('npm install @reduxjs/toolkit'))).toBe(true);
    });

    test('should skip git initialization when useGit is false', async () => {
      const answers = {
        projectName: 'test-no-git',
        projectType: 'frontend',
        framework: 'nextjs',
        language: 'typescript',
        styling: 'tailwind',
        folderStructure: 'atomic',
        packageManager: 'yarn',
        useGit: false,
      };

      await createProject(answers, tempDir);

      expect(initGit).not.toHaveBeenCalled();
    });
  });

  describe('React (Vite) Project Creation Workflow', () => {
    test('should execute workflow for React with Vite', async () => {
      const answers = {
        projectName: 'test-react',
        projectType: 'frontend',
        framework: 'react',
        language: 'typescript',
        styling: 'tailwind',
        folderStructure: 'feature-based',
        packageManager: 'pnpm',
        useGit: true,
        uiLibrary: 'mui',
        testing: ['vitest'],
      };

      await createProject(answers, tempDir);

      const allCalls = execCommand.mock.calls.map((call) => call[0]);

      // Verify Vite was called
      expect(allCalls.some((cmd) => cmd.includes('create vite@latest'))).toBe(true);
      expect(allCalls.some((cmd) => cmd.includes('react-ts'))).toBe(true);

      // Verify MUI installation
      expect(allCalls.some((cmd) => cmd.includes('@mui/material @emotion/react'))).toBe(true);

      // Verify Vitest installation
      expect(allCalls.some((cmd) => cmd.includes('vitest'))).toBe(true);
    });
  });

  describe('Express Backend Creation Workflow', () => {
    test('should execute workflow for Express backend', async () => {
      const answers = {
        projectName: 'test-express',
        projectType: 'backend',
        framework: 'express',
        language: 'typescript',
        folderStructure: 'mvc',
        packageManager: 'npm',
        useGit: true,
        orm: 'drizzle',
        database: 'postgresql',
        authentication: 'clerk',
        testing: ['jest'],
      };

      await createProject(answers, tempDir);

      const allCalls = execCommand.mock.calls.map((call) => call[0]);

      // Verify Express generator was called
      expect(
        allCalls.some((cmd) => cmd.includes('express-generator') || cmd.includes('express'))
      ).toBe(true);

      // Verify Drizzle ORM
      expect(allCalls.some((cmd) => cmd.includes('drizzle-orm'))).toBe(true);
      expect(allCalls.some((cmd) => cmd.includes('drizzle-kit'))).toBe(true);

      // Verify Clerk
      expect(allCalls.some((cmd) => cmd.includes('@clerk/clerk-sdk-node'))).toBe(true);

      // Verify Jest
      expect(allCalls.some((cmd) => cmd.includes('jest'))).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle CLI command failures gracefully', async () => {
      execCommand.mockRejectedValueOnce(new Error('Command failed: create-next-app'));

      const answers = {
        projectName: 'test-error',
        projectType: 'frontend',
        framework: 'nextjs',
        language: 'typescript',
        styling: 'tailwind',
        folderStructure: 'feature-based',
        packageManager: 'npm',
        useGit: false,
      };

      await expect(createProject(answers, tempDir)).rejects.toThrow();
    });
  });

  describe('Package Manager Support', () => {
    test.each([
      ['npm', 'npm install', '--use-npm'],
      ['yarn', 'yarn', '--use-yarn'],
      ['pnpm', 'pnpm install', '--use-pnpm'],
      ['bun', 'bun install', '--use-bun'],
    ])('should use correct commands for %s', async (packageManager, installCmd, cliFlag) => {
      const answers = {
        projectName: `test-${packageManager}`,
        projectType: 'frontend',
        framework: 'nextjs',
        language: 'typescript',
        styling: 'tailwind',
        folderStructure: 'feature-based',
        packageManager,
        useGit: false,
      };

      await createProject(answers, tempDir);

      const allCalls = execCommand.mock.calls.map((call) => call[0]);

      // Verify correct package manager flag
      expect(allCalls.some((cmd) => cmd.includes(cliFlag))).toBe(true);

      // Verify correct install command
      expect(allCalls.some((cmd) => cmd === installCmd)).toBe(true);
    });
  });
});
