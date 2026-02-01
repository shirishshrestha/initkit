#!/usr/bin/env node

/**
 * Comprehensive Edge Case Testing for InitKit
 * Tests all combinations of frameworks, package managers, and features
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TIMEOUT = 180000; // 3 minutes per test

// Comprehensive test scenarios
const testScenarios = [
  // ==================== FRONTEND SCENARIOS ====================
  {
    name: 'React+Vite + TypeScript + Tailwind',
    projectName: 'test-react-vite-ts-tw',
    answers: [
      'frontend',
      'test-react-vite-ts-tw',
      'react',
      'typescript',
      'feature',
      'moderate',
      'tailwind',
      'none',
      'none',
      'none',
      '',
      '',
      'eslint,prettier',
      'npm',
      'no'
    ]
  },
  {
    name: 'React+Vite + JavaScript + CSS',
    projectName: 'test-react-vite-js-css',
    answers: [
      'frontend',
      'test-react-vite-js-css',
      'react',
      'javascript',
      'feature',
      '',
      'css',
      'none',
      'none',
      'none',
      '',
      '',
      '',
      'npm',
      'no'
    ]
  },
  {
    name: 'React+Vite + shadcn + Zustand',
    projectName: 'test-react-shadcn-zustand',
    answers: [
      'frontend',
      'test-react-shadcn-zustand',
      'react',
      'typescript',
      'feature',
      'moderate',
      'tailwind',
      'zustand',
      'shadcn',
      'none',
      '',
      '',
      'eslint,prettier',
      'npm',
      'no'
    ]
  },
  {
    name: 'Next.js + TypeScript + Tailwind',
    projectName: 'test-nextjs-ts-tw',
    answers: [
      'frontend',
      'test-nextjs-ts-tw',
      'nextjs',
      'typescript',
      'feature',
      'moderate',
      'tailwind',
      'none',
      'none',
      '',
      '',
      '',
      'eslint,prettier',
      'npm',
      'no'
    ]
  },
  {
    name: 'Next.js + shadcn',
    projectName: 'test-nextjs-shadcn',
    answers: [
      'frontend',
      'test-nextjs-shadcn',
      'nextjs',
      'typescript',
      'feature',
      'strict',
      'tailwind',
      'none',
      'shadcn',
      'none',
      '',
      '',
      'eslint,prettier,env',
      'npm',
      'no'
    ]
  },
  {
    name: 'Vue + Vite + TypeScript + Tailwind',
    projectName: 'test-vue-vite-ts-tw',
    answers: [
      'frontend',
      'test-vue-vite-ts-tw',
      'vue',
      'typescript',
      'feature',
      'moderate',
      'tailwind',
      'pinia',
      'none',
      'none',
      '',
      '',
      'eslint,prettier',
      'npm',
      'no'
    ]
  },
  {
    name: 'Vue + JavaScript + Sass',
    projectName: 'test-vue-js-sass',
    answers: [
      'frontend',
      'test-vue-js-sass',
      'vue',
      'javascript',
      'feature',
      '',
      'sass',
      'none',
      'none',
      'none',
      '',
      '',
      '',
      'npm',
      'no'
    ]
  },

  // ==================== BACKEND SCENARIOS ====================
  {
    name: 'Express + TypeScript + PostgreSQL',
    projectName: 'test-express-ts-pg',
    answers: [
      'backend',
      'test-express-ts-pg',
      'express',
      'typescript',
      'feature',
      'moderate',
      'postgresql',
      'prisma',
      '',
      'eslint,prettier,env',
      'npm',
      'no'
    ]
  },
  {
    name: 'Express + JavaScript + MongoDB',
    projectName: 'test-express-js-mongo',
    answers: [
      'backend',
      'test-express-js-mongo',
      'express',
      'javascript',
      'feature',
      '',
      'mongodb',
      'mongoose',
      '',
      'eslint,prettier',
      'npm',
      'no'
    ]
  },
  {
    name: 'Express + MySQL + TypeORM',
    projectName: 'test-express-mysql-typeorm',
    answers: [
      'backend',
      'test-express-mysql-typeorm',
      'express',
      'typescript',
      'clean',
      'strict',
      'mysql',
      'typeorm',
      '',
      'eslint,prettier,env,editorconfig',
      'npm',
      'no'
    ]
  },

  // ==================== LIBRARY SCENARIOS ====================
  {
    name: 'Library + TypeScript',
    projectName: 'test-library-ts',
    answers: [
      'library',
      'test-library-ts',
      'typescript',
      'feature',
      'strict',
      '',
      'eslint,prettier',
      'npm',
      'no'
    ]
  },

  // ==================== PACKAGE MANAGER VARIATIONS ====================
  {
    name: 'React+Vite with pnpm',
    projectName: 'test-react-pnpm',
    answers: [
      'frontend',
      'test-react-pnpm',
      'react',
      'typescript',
      'feature',
      'moderate',
      'tailwind',
      'none',
      'none',
      'none',
      '',
      '',
      'eslint,prettier',
      'pnpm',
      'no'
    ]
  },
  {
    name: 'React+Vite with yarn',
    projectName: 'test-react-yarn',
    answers: [
      'frontend',
      'test-react-yarn',
      'react',
      'typescript',
      'feature',
      'moderate',
      'tailwind',
      'none',
      'none',
      'none',
      '',
      '',
      'eslint,prettier',
      'yarn',
      'no'
    ]
  },
  {
    name: 'React+Vite with bun',
    projectName: 'test-react-bun',
    answers: [
      'frontend',
      'test-react-bun',
      'react',
      'typescript',
      'feature',
      'moderate',
      'css',
      'none',
      'none',
      'none',
      '',
      '',
      '',
      'bun',
      'no'
    ]
  }
];

let passCount = 0;
let failCount = 0;
const failedTests = [];

async function runTest(scenario) {
  const projectPath = join(__dirname, scenario.projectName);

  console.log(`\n${'='.repeat(70)}`);
  console.log(`🧪 Testing: ${scenario.name}`);
  console.log(`${'='.repeat(70)}\n`);

  // Clean up before test
  if (await fs.pathExists(projectPath)) {
    await fs.remove(projectPath);
  }

  return new Promise((resolve) => {
    const initkit = spawn('node', ['bin/index.js'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let output = '';
    let errorOutput = '';
    let answerIndex = 0;
    let testPassed = false;
    let errorMessage = '';

    const sendNextAnswer = () => {
      if (answerIndex < scenario.answers.length) {
        const answer = scenario.answers[answerIndex++];
        setTimeout(() => {
          initkit.stdin.write(answer + '\n');
        }, 100);
      }
    };

    initkit.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);

      if (text.includes('?') || text.includes('›')) {
        sendNextAnswer();
      }

      if (text.includes('Project created successfully')) {
        testPassed = true;
      }

      // Capture error messages
      if (text.includes('Error:') || text.includes('✖') || text.includes('failed')) {
        errorMessage += text;
      }
    });

    initkit.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      process.stderr.write(text);
      errorMessage += text;
    });

    const timeout = setTimeout(() => {
      initkit.kill();
      console.log(`\n⏱️  TIMEOUT after ${TIMEOUT / 1000}s`);
      resolve({ passed: false, error: 'Timeout' });
    }, TIMEOUT);

    initkit.on('close', async (code) => {
      clearTimeout(timeout);
      const passed = code === 0 && testPassed;

      if (passed) {
        console.log(`\n✅ ${scenario.name} PASSED`);
        passCount++;

        // Verify key files exist
        const checks = [];
        if (await fs.pathExists(projectPath)) {
          checks.push(`✓ Project directory created`);
          
          const packageJsonPath = join(projectPath, 'package.json');
          if (await fs.pathExists(packageJsonPath)) {
            checks.push(`✓ package.json exists`);
          }

          const srcPath = join(projectPath, 'src');
          if (await fs.pathExists(srcPath)) {
            checks.push(`✓ src directory exists`);
          }
        }

        if (checks.length > 0) {
          console.log(`\n   ${checks.join('\n   ')}`);
        }
      } else {
        console.log(`\n❌ ${scenario.name} FAILED - Exit code ${code}`);
        failCount++;
        failedTests.push({
          name: scenario.name,
          error: errorMessage || `Exit code ${code}`,
          code
        });
      }

      // Clean up
      if (await fs.pathExists(projectPath)) {
        await fs.remove(projectPath);
        console.log(`   Cleaned up ${scenario.projectName}`);
      }

      resolve({ passed, error: errorMessage });
    });

    setTimeout(() => sendNextAnswer(), 500);
  });
}

async function runAllTests() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║   InitKit Comprehensive Edge Case Testing Suite         ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  console.log(`Testing ${testScenarios.length} scenarios...\n`);

  const startTime = Date.now();

  for (const scenario of testScenarios) {
    await runTest(scenario);
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                    TEST SUMMARY                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  console.log(`Total Tests: ${testScenarios.length}`);
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`⏱️  Duration: ${duration}s\n`);

  if (failedTests.length > 0) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('FAILED TESTS DETAILS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    failedTests.forEach((test, index) => {
      console.log(`${index + 1}. ${test.name}`);
      console.log(`   Error: ${test.error.substring(0, 200)}...`);
      console.log('');
    });
  }

  process.exit(failCount > 0 ? 1 : 0);
}

runAllTests();
