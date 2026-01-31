#!/usr/bin/env node

/**
 * Quick test for the Tailwind CSS + shadcn/ui fix
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const answers = [
  'Frontend Only',
  'my-frontend-app',
  'React + Vite',
  'TypeScript (Recommended)',
  'Feature-based (Organize by feature/module)',
  'Strict (Recommended for new projects)',
  'Tailwind CSS',
  'Redux Toolkit (Official Redux)',
  'shadcn/ui (Radix + Tailwind)',
  'None',
  '', // No testing frameworks
  'Axios (HTTP client)',
  'ESLint (Code linting)',
  'pnpm',
  'Yes',
];

async function runTest() {
  const projectPath = path.join(__dirname, 'my-frontend-app');

  try {
    // Clean up if exists
    try {
      await fs.rm(projectPath, { recursive: true, force: true });
    } catch (err) {
      // Ignore
    }

    console.log('🧪 Testing React + Vite + Tailwind + shadcn/ui with pnpm...\n');

    await new Promise((resolve, reject) => {
      const child = spawn('node', ['bin/index.js'], {
        cwd: __dirname,
        stdio: ['pipe', 'inherit', 'inherit'],
        shell: true,
      });

      let answerIndex = 0;
      let buffer = '';

      // Read stdout to detect prompts
      const originalStdout = process.stdout.write.bind(process.stdout);
      process.stdout.write = (chunk, ...args) => {
        buffer += chunk.toString();

        // Detect question prompts
        if (buffer.includes('?') && answerIndex < answers.length) {
          setTimeout(() => {
            if (answerIndex < answers.length) {
              child.stdin.write(`${answers[answerIndex]}\n`);
              answerIndex++;
            }
          }, 200);
          buffer = ''; // Clear buffer after detecting question
        }

        return originalStdout(chunk, ...args);
      };

      child.on('close', (code) => {
        process.stdout.write = originalStdout;
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      child.on('error', (err) => {
        process.stdout.write = originalStdout;
        reject(err);
      });

      // Timeout after 3 minutes
      setTimeout(
        () => {
          process.stdout.write = originalStdout;
          child.kill();
          reject(new Error('Test timed out after 3 minutes'));
        },
        3 * 60 * 1000
      );
    });

    // Verify project was created
    const stats = await fs.stat(projectPath);
    if (!stats.isDirectory()) {
      throw new Error('Project directory was not created');
    }

    // Verify key files exist
    const requiredFiles = [
      'package.json',
      'tailwind.config.js',
      'postcss.config.js',
      'src/index.css',
      'tsconfig.json',
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(projectPath, file);
      try {
        await fs.access(filePath);
        console.log(`✓ ${file} exists`);
      } catch (err) {
        throw new Error(`Required file missing: ${file}`);
      }
    }

    console.log('\n✅ Test PASSED!\n');
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Test FAILED: ${error.message}\n`);
    process.exit(1);
  }
}

runTest();
