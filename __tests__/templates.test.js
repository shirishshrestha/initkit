/**
 * Comprehensive template generation tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateReactTemplate } from '../src/templates/react.js';
import { generateNextjsTemplate } from '../src/templates/nextjs.js';
import { generateVueTemplate } from '../src/templates/vue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testOutputDir = path.join(__dirname, '..', 'test-output');

describe('Template Generation Tests', () => {
  beforeEach(async () => {
    await fs.ensureDir(testOutputDir);
  });

  afterEach(async () => {
    // Clean up test projects
    await fs.remove(testOutputDir);
  });

  describe('React Template', () => {
    it('should generate React project with TypeScript', async () => {
      const projectPath = path.join(testOutputDir, 'test-react-ts');
      const config = {
        projectName: 'test-react-ts',
        language: 'typescript',
        folderStructure: 'feature-based',
        styling: 'tailwind',
        additionalLibraries: ['redux-toolkit', 'tanstack-query'],
        packageManager: 'npm',
      };

      await generateReactTemplate(projectPath, config);

      // Check essential files exist
      expect(await fs.pathExists(path.join(projectPath, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'src', 'App.tsx'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'src', 'main.tsx'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'vite.config.ts'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'index.html'))).toBe(true);

      // Check package.json content
      const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
      expect(packageJson.name).toBe('test-react-ts');
      expect(packageJson.dependencies).toHaveProperty('react');
      expect(packageJson.dependencies).toHaveProperty('@reduxjs/toolkit');
      expect(packageJson.dependencies).toHaveProperty('@tanstack/react-query');
      expect(packageJson.devDependencies).toHaveProperty('typescript');
      expect(packageJson.devDependencies).toHaveProperty('tailwindcss');

      // Check versions are not 'latest' string but actual versions
      expect(packageJson.dependencies.react).toMatch(/^\^?\d+\.\d+\.\d+/);
    });

    it('should generate React project with JavaScript', async () => {
      const projectPath = path.join(testOutputDir, 'test-react-js');
      const config = {
        projectName: 'test-react-js',
        language: 'javascript',
        folderStructure: 'component-based',
        styling: 'css',
        additionalLibraries: ['axios'],
        packageManager: 'pnpm',
      };

      await generateReactTemplate(projectPath, config);

      expect(await fs.pathExists(path.join(projectPath, 'src', 'App.jsx'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'src', 'main.jsx'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'vite.config.js'))).toBe(true);

      const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
      expect(packageJson.devDependencies).not.toHaveProperty('typescript');
      expect(packageJson.dependencies).toHaveProperty('axios');
    });
  });

  describe('Next.js Template', () => {
    it('should generate Next.js project with App Router', async () => {
      const projectPath = path.join(testOutputDir, 'test-nextjs');
      const config = {
        projectName: 'test-nextjs',
        language: 'typescript',
        folderStructure: 'feature-based',
        styling: 'tailwind',
        additionalLibraries: ['tanstack-query', 'zod'],
        packageManager: 'npm',
      };

      await generateNextjsTemplate(projectPath, config);

      // Check essential files
      expect(await fs.pathExists(path.join(projectPath, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'src', 'app', 'layout.tsx'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'src', 'app', 'page.tsx'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'src', 'app', 'globals.css'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'next.config.ts'))).toBe(true);

      const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
      expect(packageJson.dependencies).toHaveProperty('next');
      expect(packageJson.dependencies).toHaveProperty('react');
      expect(packageJson.dependencies).toHaveProperty('@tanstack/react-query');
      expect(packageJson.dependencies).toHaveProperty('zod');
      expect(packageJson.dependencies.next).toMatch(/^\^?\d+\.\d+\.\d+/);
    });
  });

  describe('Vue Template', () => {
    it('should generate Vue project with TypeScript', async () => {
      const projectPath = path.join(testOutputDir, 'test-vue');
      const config = {
        projectName: 'test-vue',
        language: 'typescript',
        folderStructure: 'feature-based',
        styling: 'tailwind',
        additionalLibraries: ['axios'],
        packageManager: 'yarn',
      };

      await generateVueTemplate(projectPath, config);

      expect(await fs.pathExists(path.join(projectPath, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'src', 'App.vue'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'src', 'main.ts'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'vite.config.ts'))).toBe(true);

      const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
      expect(packageJson.dependencies).toHaveProperty('vue');
      expect(packageJson.dependencies).toHaveProperty('vue-router');
      expect(packageJson.dependencies).toHaveProperty('pinia');
      expect(packageJson.dependencies).toHaveProperty('axios');
      expect(packageJson.dependencies.vue).toMatch(/^\^?\d+\.\d+\.\d+/);
    });
  });

  describe('Package Manager Tests', () => {
    it('should use correct package manager commands in README', async () => {
      const managers = ['npm', 'yarn', 'pnpm', 'bun'];

      for (const pm of managers) {
        const projectPath = path.join(testOutputDir, `test-pm-${pm}`);
        const config = {
          projectName: `test-pm-${pm}`,
          language: 'typescript',
          folderStructure: 'feature-based',
          packageManager: pm,
        };

        await generateReactTemplate(projectPath, config);

        const readme = await fs.readFile(path.join(projectPath, 'README.md'), 'utf-8');
        expect(readme).toContain(`${pm} install`);

        if (pm === 'npm') {
          expect(readme).toContain('npm run dev');
        } else {
          expect(readme).toContain(`${pm} dev`);
        }
      }
    });
  });
});
