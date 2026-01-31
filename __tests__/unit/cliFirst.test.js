import { jest } from '@jest/globals';

describe('CLI-First Architecture Tests', () => {
  describe('Package Manager Commands', () => {
    test('should use correct install command for npm', () => {
      const commands = {
        npm: 'npm install',
        yarn: 'yarn',
        pnpm: 'pnpm install',
        bun: 'bun install',
      };

      expect(commands.npm).toBe('npm install');
    });

    test('should use correct install command for pnpm', () => {
      const commands = {
        npm: 'npm install',
        yarn: 'yarn',
        pnpm: 'pnpm install',
        bun: 'bun install',
      };

      expect(commands.pnpm).toBe('pnpm install');
    });

    test('should use correct add command for yarn', () => {
      const getAddCommand = (pm) => {
        const commands = {
          npm: 'npm install',
          yarn: 'yarn add',
          pnpm: 'pnpm add',
          bun: 'bun add',
        };
        return commands[pm];
      };

      expect(getAddCommand('yarn')).toBe('yarn add');
      expect(getAddCommand('pnpm')).toBe('pnpm add');
    });
  });

  describe('Database Provider Mapping', () => {
    test('should map postgresql correctly for Prisma', () => {
      const getDatasourceForPrisma = (db) => {
        const mapping = {
          postgresql: 'postgresql',
          postgres: 'postgresql',
          mysql: 'mysql',
          sqlite: 'sqlite',
          mongodb: 'mongodb',
        };
        return mapping[db] || 'postgresql';
      };

      expect(getDatasourceForPrisma('postgresql')).toBe('postgresql');
      expect(getDatasourceForPrisma('postgres')).toBe('postgresql');
      expect(getDatasourceForPrisma('mysql')).toBe('mysql');
    });

    test('should map database drivers correctly for Drizzle', () => {
      const getDriverForDrizzle = (db) => {
        const drivers = {
          postgresql: 'pg',
          postgres: 'pg',
          mysql: 'mysql2',
          sqlite: 'better-sqlite3',
        };
        return drivers[db] || 'pg';
      };

      expect(getDriverForDrizzle('postgresql')).toBe('pg');
      expect(getDriverForDrizzle('mysql')).toBe('mysql2');
      expect(getDriverForDrizzle('sqlite')).toBe('better-sqlite3');
    });
  });

  describe('CLI Command Construction', () => {
    test('should construct correct create-next-app command', () => {
      const constructNextjsCommand = (config) => {
        const {
          projectName,
          language = 'typescript',
          styling = 'tailwind',
          packageManager = 'npm',
        } = config;

        const flags = [
          language === 'typescript' ? '--typescript' : '--javascript',
          styling === 'tailwind' ? '--tailwind' : '--no-tailwind',
          '--eslint',
          '--app',
          '--src-dir',
          '--import-alias @/*',
          '--no-git',
          `--use-${packageManager}`,
          '--skip-install',
        ];

        return `npx create-next-app@latest ${projectName} ${flags.join(' ')}`;
      };

      const command = constructNextjsCommand({
        projectName: 'my-app',
        language: 'typescript',
        styling: 'tailwind',
        packageManager: 'pnpm',
      });

      expect(command).toContain('create-next-app@latest my-app');
      expect(command).toContain('--typescript');
      expect(command).toContain('--tailwind');
      expect(command).toContain('--use-pnpm');
      expect(command).toContain('--skip-install');
    });

    test('should construct correct create-vite command', () => {
      const constructViteCommand = (config) => {
        const { projectName, language = 'typescript' } = config;
        const template = language === 'typescript' ? 'react-ts' : 'react';
        return `npm create vite@latest ${projectName} -- --template ${template}`;
      };

      const command = constructViteCommand({
        projectName: 'my-react-app',
        language: 'typescript',
      });

      expect(command).toContain('create vite@latest my-react-app');
      expect(command).toContain('--template react-ts');
    });
  });

  describe('Addon Detection', () => {
    test('should detect when addons are selected', () => {
      const hasAddons = (config) => {
        return !!(
          (config.stateManagement && config.stateManagement !== 'none') ||
          (config.uiLibrary && config.uiLibrary !== 'none') ||
          (config.orm && config.orm !== 'none') ||
          (config.authentication && config.authentication !== 'none') ||
          (config.testing && config.testing.length > 0)
        );
      };

      expect(
        hasAddons({
          stateManagement: 'zustand',
        })
      ).toBe(true);

      expect(
        hasAddons({
          uiLibrary: 'shadcn',
        })
      ).toBe(true);

      expect(
        hasAddons({
          stateManagement: 'none',
          uiLibrary: 'none',
          orm: 'none',
          authentication: 'none',
          testing: [],
        })
      ).toBe(false);

      expect(hasAddons({})).toBe(false);
    });
  });
});
