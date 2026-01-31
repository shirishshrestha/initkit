#!/usr/bin/env node

/**
 * Comprehensive test for InitKit CLI
 * Tests various combinations of frontend/backend/fullstack projects
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testConfigurations = [
  // Frontend Tests
  {
    name: 'React + Vite + Tailwind + shadcn (pnpm)',
    type: 'frontend',
    answers: [
      'Frontend Only', // Project type
      'test-react-tailwind-pnpm', // Project name
      'React + Vite', // Framework
      'TypeScript (Recommended)', // Language
      'Feature-based (Organize by feature/module)', // Structure
      'Strict (Recommended for new projects)', // TS strictness
      'Tailwind CSS', // Styling
      'Redux Toolkit (Official Redux)', // State management
      'shadcn/ui (Radix + Tailwind)', // UI library
      'None', // Auth
      '', // Testing (none)
      'Axios (HTTP client)', // Additional libraries (just one)
      'ESLint (Code linting)', // Dev tools (just one)
      'pnpm', // Package manager
      'Yes', // Git
    ],
  },
  {
    name: 'React + Vite + Basic (npm)',
    type: 'frontend',
    answers: [
      'Frontend Only',
      'test-react-basic-npm',
      'React + Vite',
      'TypeScript (Recommended)',
      'Feature-based (Organize by feature/module)',
      'Strict (Recommended for new projects)',
      'CSS (No framework)',
      'None',
      'None',
      'None',
      '',
      '',
      '',
      'npm',
      'No',
    ],
  },
  {
    name: 'Next.js + Tailwind (yarn)',
    type: 'frontend',
    answers: [
      'Frontend Only',
      'test-nextjs-tailwind-yarn',
      'Next.js',
      'TypeScript (Recommended)',
      'Feature-based (Organize by feature/module)',
      'Strict (Recommended for new projects)',
      'Tailwind CSS',
      'None',
      'None',
      'None',
      '',
      '',
      '',
      'yarn',
      'No',
    ],
  },
  {
    name: 'Vue + Vite + Sass (bun)',
    type: 'frontend',
    answers: [
      'Frontend Only',
      'test-vue-sass-bun',
      'Vue',
      'TypeScript (Recommended)',
      'Feature-based (Organize by feature/module)',
      'Strict (Recommended for new projects)',
      'Sass/SCSS',
      'Pinia (Official Vue)',
      'None',
      'None',
      '',
      '',
      '',
      'bun',
      'No',
    ],
  },
  // Backend Tests
  {
    name: 'Express + Basic (npm)',
    type: 'backend',
    answers: [
      'Backend Only',
      'test-express-npm',
      'Express',
      'JavaScript',
      'Feature-based (Organize by feature/module)',
      'None',
      'None',
      'None',
      'None',
      '',
      '',
      '',
      'npm',
      'No',
    ],
  },
];

async function runTest(config) {
  const startTime = Date.now();
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 Testing: ${config.name}`);
  console.log(`${'='.repeat(80)}\n`);

  const projectPath = path.join(__dirname, config.answers[1]);

  try {
    // Clean up if project exists
    try {
      await fs.rm(projectPath, { recursive: true, force: true });
      console.log(`✓ Cleaned up existing project: ${config.answers[1]}`);
    } catch (err) {
      // Ignore if doesn't exist
    }

    // Run the CLI
    await new Promise((resolve, reject) => {
      const child = spawn('node', ['bin/index.js'], {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
      });

      let answerIndex = 0;
      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        process.stdout.write(text);

        // Send answers when prompted
        if (text.includes('?') && answerIndex < config.answers.length) {
          setTimeout(() => {
            child.stdin.write(`${config.answers[answerIndex]}\n`);
            answerIndex++;
          }, 100);
        }
      });

      child.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        process.stderr.write(text);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ output, errorOutput });
        } else {
          reject(
            new Error(`Process exited with code ${code}\nOutput: ${output}\nError: ${errorOutput}`)
          );
        }
      });

      child.on('error', (err) => {
        reject(err);
      });

      // Timeout after 5 minutes
      setTimeout(
        () => {
          child.kill();
          reject(new Error('Test timed out after 5 minutes'));
        },
        5 * 60 * 1000
      );
    });

    // Verify project was created
    const stats = await fs.stat(projectPath);
    if (!stats.isDirectory()) {
      throw new Error('Project directory was not created');
    }

    // Verify package.json exists
    const packageJsonPath = path.join(projectPath, 'package.json');
    await fs.access(packageJsonPath);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ SUCCESS: ${config.name} (${duration}s)\n`);

    return { success: true, config, duration };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n❌ FAILED: ${config.name} (${duration}s)`);
    console.error(`Error: ${error.message}\n`);

    return { success: false, config, duration, error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting Comprehensive InitKit Tests\n');
  console.log(`Testing ${testConfigurations.length} configurations...\n`);

  const results = [];

  for (const config of testConfigurations) {
    const result = await runTest(config);
    results.push(result);
  }

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80) + '\n');

  const passed = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log();

  if (passed.length > 0) {
    console.log('Passed Tests:');
    passed.forEach((r) => {
      console.log(`  ✓ ${r.config.name} (${r.duration}s)`);
    });
    console.log();
  }

  if (failed.length > 0) {
    console.log('Failed Tests:');
    failed.forEach((r) => {
      console.log(`  ✗ ${r.config.name} (${r.duration}s)`);
      console.log(`    Error: ${r.error}`);
    });
    console.log();
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
