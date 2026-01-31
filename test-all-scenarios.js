#!/usr/bin/env node

/**
 * Comprehensive Test Suite for InitKit CLI
 * Tests all major edge cases and scenarios
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configurations covering all edge cases
const testScenarios = [
  // ==================== FRONTEND TESTS ====================

  // Edge Case 1: React + Tailwind + shadcn + pnpm (Original failing case)
  {
    name: 'React+Vite+Tailwind+shadcn+pnpm',
    type: 'frontend',
    timeout: 180,
    answers: [
      'Frontend Only',
      'test-react-tailwind-shadcn-pnpm',
      'React + Vite',
      'TypeScript (Recommended)',
      'Feature-based (Organize by feature/module)',
      'Strict (Recommended for new projects)',
      'Tailwind CSS',
      'Redux Toolkit (Official Redux)',
      'shadcn/ui (Radix + Tailwind)',
      'None',
      '',
      '',
      '',
      'pnpm',
      'No',
    ],
    verify: ['tailwind.config.js', 'postcss.config.js', 'src/index.css', 'tsconfig.json'],
  },

  // Edge Case 2: React + Tailwind + yarn
  {
    name: 'React+Vite+Tailwind+yarn',
    type: 'frontend',
    timeout: 180,
    answers: [
      'Frontend Only',
      'test-react-tailwind-yarn',
      'React + Vite',
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
    verify: ['tailwind.config.js', 'postcss.config.js', 'src/index.css'],
  },

  // Edge Case 3: React + Tailwind + bun
  {
    name: 'React+Vite+Tailwind+bun',
    type: 'frontend',
    timeout: 180,
    answers: [
      'Frontend Only',
      'test-react-tailwind-bun',
      'React + Vite',
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
      'bun',
      'No',
    ],
    verify: ['tailwind.config.js', 'postcss.config.js', 'src/index.css'],
  },

  // Edge Case 4: Next.js + Tailwind + pnpm
  {
    name: 'Next.js+Tailwind+pnpm',
    type: 'frontend',
    timeout: 180,
    answers: [
      'Frontend Only',
      'test-nextjs-tailwind-pnpm',
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
      'pnpm',
      'No',
    ],
    verify: ['tailwind.config.js', 'postcss.config.js'],
  },

  // Edge Case 5: Vue + Sass + bun
  {
    name: 'Vue+Sass+bun',
    type: 'frontend',
    timeout: 180,
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
    verify: ['package.json'],
  },

  // Edge Case 6: React + Material-UI + npm
  {
    name: 'React+MaterialUI+npm',
    type: 'frontend',
    timeout: 180,
    answers: [
      'Frontend Only',
      'test-react-mui-npm',
      'React + Vite',
      'TypeScript (Recommended)',
      'Feature-based (Organize by feature/module)',
      'Strict (Recommended for new projects)',
      'CSS (No framework)',
      'Zustand',
      'Material-UI',
      'None',
      '',
      '',
      '',
      'npm',
      'No',
    ],
    verify: ['package.json'],
  },

  // Edge Case 7: React + Styled Components + Chakra UI + yarn
  {
    name: 'React+StyledComponents+Chakra+yarn',
    type: 'frontend',
    timeout: 180,
    answers: [
      'Frontend Only',
      'test-react-styled-chakra-yarn',
      'React + Vite',
      'TypeScript (Recommended)',
      'Feature-based (Organize by feature/module)',
      'Strict (Recommended for new projects)',
      'Styled Components',
      'Jotai',
      'Chakra UI',
      'None',
      '',
      '',
      '',
      'yarn',
      'No',
    ],
    verify: ['package.json'],
  },

  // Edge Case 8: React + Emotion + Mantine + pnpm
  {
    name: 'React+Emotion+Mantine+pnpm',
    type: 'frontend',
    timeout: 180,
    answers: [
      'Frontend Only',
      'test-react-emotion-mantine-pnpm',
      'React + Vite',
      'TypeScript (Recommended)',
      'Feature-based (Organize by feature/module)',
      'Strict (Recommended for new projects)',
      'Emotion',
      'Recoil',
      'Mantine',
      'None',
      '',
      '',
      '',
      'pnpm',
      'No',
    ],
    verify: ['package.json'],
  },

  // Edge Case 9: Next.js + shadcn + Clerk + pnpm
  {
    name: 'Next.js+shadcn+Clerk+pnpm',
    type: 'frontend',
    timeout: 200,
    answers: [
      'Frontend Only',
      'test-nextjs-shadcn-clerk-pnpm',
      'Next.js',
      'TypeScript (Recommended)',
      'Feature-based (Organize by feature/module)',
      'Strict (Recommended for new projects)',
      'Tailwind CSS',
      'None',
      'shadcn/ui (Radix + Tailwind)',
      'Clerk',
      '',
      '',
      '',
      'pnpm',
      'No',
    ],
    verify: ['tailwind.config.js', 'postcss.config.js', 'tsconfig.json'],
  },

  // Edge Case 10: React + All Additional Libraries + npm
  {
    name: 'React+AllLibraries+npm',
    type: 'frontend',
    timeout: 200,
    answers: [
      'Frontend Only',
      'test-react-all-libs-npm',
      'React + Vite',
      'TypeScript (Recommended)',
      'Feature-based (Organize by feature/module)',
      'Strict (Recommended for new projects)',
      'CSS (No framework)',
      'None',
      'None',
      'None',
      '',
      'Axios (HTTP client), Lodash (Utility library), Date-fns (Date utility), Zod (Schema validation), TanStack Query (Data fetching)',
      'ESLint (Code linting), Prettier (Code formatting), Environment variables (.env), EditorConfig',
      'npm',
      'No',
    ],
    verify: ['package.json'],
  },

  // ==================== BACKEND TESTS ====================

  // Edge Case 11: Express + JavaScript + npm
  {
    name: 'Express+JavaScript+npm',
    type: 'backend',
    timeout: 120,
    answers: [
      'Backend Only',
      'test-express-js-npm',
      'Express',
      'JavaScript',
      'Feature-based (Organize by feature/module)',
      '',
      '',
      'npm',
      'No',
    ],
    verify: ['package.json', 'app.js'],
  },

  // Edge Case 12: Express + TypeScript + Prisma + PostgreSQL + pnpm
  {
    name: 'Express+TypeScript+Prisma+PostgreSQL+pnpm',
    type: 'backend',
    timeout: 150,
    answers: [
      'Backend Only',
      'test-express-ts-prisma-pnpm',
      'Express',
      'TypeScript',
      'Feature-based (Organize by feature/module)',
      'Prisma',
      'PostgreSQL',
      '',
      '',
      'pnpm',
      'No',
    ],
    verify: ['package.json', 'prisma/schema.prisma', '.env'],
  },

  // Edge Case 13: Express + Drizzle + MySQL + yarn
  {
    name: 'Express+Drizzle+MySQL+yarn',
    type: 'backend',
    timeout: 150,
    answers: [
      'Backend Only',
      'test-express-drizzle-mysql-yarn',
      'Express',
      'TypeScript',
      'Feature-based (Organize by feature/module)',
      'Drizzle',
      'MySQL',
      '',
      '',
      'yarn',
      'No',
    ],
    verify: ['package.json'],
  },

  // Edge Case 14: Express + Mongoose + bun
  {
    name: 'Express+Mongoose+bun',
    type: 'backend',
    timeout: 150,
    answers: [
      'Backend Only',
      'test-express-mongoose-bun',
      'Express',
      'TypeScript',
      'Feature-based (Organize by feature/module)',
      'Mongoose',
      'MongoDB',
      '',
      '',
      'bun',
      'No',
    ],
    verify: ['package.json'],
  },

  // ==================== EDGE CASES ====================

  // Edge Case 15: Minimal React (no addons, npm)
  {
    name: 'React+Minimal+npm',
    type: 'frontend',
    timeout: 120,
    answers: [
      'Frontend Only',
      'test-react-minimal-npm',
      'React + Vite',
      'JavaScript',
      'Flat (All files in src/)',
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
    verify: ['package.json', 'src/App.jsx'],
  },

  // Edge Case 16: Next.js + Full Stack (Prisma + Clerk + Tailwind) + pnpm
  {
    name: 'Next.js+FullStack+pnpm',
    type: 'frontend',
    timeout: 240,
    answers: [
      'Frontend Only',
      'test-nextjs-fullstack-pnpm',
      'Next.js',
      'TypeScript (Recommended)',
      'Feature-based (Organize by feature/module)',
      'Strict (Recommended for new projects)',
      'Tailwind CSS',
      'None',
      'shadcn/ui (Radix + Tailwind)',
      'Clerk',
      '',
      'Axios (HTTP client), Zod (Schema validation), TanStack Query (Data fetching)',
      'ESLint (Code linting), Prettier (Code formatting)',
      'pnpm',
      'No',
    ],
    verify: ['tailwind.config.js', 'postcss.config.js', 'tsconfig.json', 'package.json'],
  },

  // Edge Case 17: Vue + Clean Architecture + pnpm
  {
    name: 'Vue+CleanArchitecture+pnpm',
    type: 'frontend',
    timeout: 180,
    answers: [
      'Frontend Only',
      'test-vue-clean-pnpm',
      'Vue',
      'TypeScript (Recommended)',
      'Clean Architecture (Enterprise apps)',
      'Strict (Recommended for new projects)',
      'Tailwind CSS',
      'Pinia (Official Vue)',
      'None',
      'None',
      '',
      '',
      '',
      'pnpm',
      'No',
    ],
    verify: ['tailwind.config.js', 'postcss.config.js', 'package.json'],
  },

  // Edge Case 18: React + Tailwind + DaisyUI + bun
  {
    name: 'React+Tailwind+DaisyUI+bun',
    type: 'frontend',
    timeout: 180,
    answers: [
      'Frontend Only',
      'test-react-tailwind-daisyui-bun',
      'React + Vite',
      'TypeScript (Recommended)',
      'Feature-based (Organize by feature/module)',
      'Strict (Recommended for new projects)',
      'Tailwind CSS',
      'None',
      'DaisyUI',
      'None',
      '',
      '',
      '',
      'bun',
      'No',
    ],
    verify: ['tailwind.config.js', 'postcss.config.js', 'package.json'],
  },
];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function cleanupProject(projectName) {
  const projectPath = path.join(__dirname, projectName);
  try {
    await fs.rm(projectPath, { recursive: true, force: true });
  } catch (err) {
    // Ignore if doesn't exist
  }
}

async function verifyFiles(projectPath, filesToVerify) {
  const results = [];
  for (const file of filesToVerify) {
    const filePath = path.join(projectPath, file);
    try {
      await fs.access(filePath);
      results.push({ file, exists: true });
    } catch (err) {
      results.push({ file, exists: false });
    }
  }
  return results;
}

async function runTest(scenario, index, total) {
  const startTime = Date.now();
  const projectName = scenario.answers[1];
  const projectPath = path.join(__dirname, projectName);

  log(`\n${'='.repeat(80)}`, 'cyan');
  log(`🧪 Test ${index + 1}/${total}: ${scenario.name}`, 'bright');
  log(`${'='.repeat(80)}`, 'cyan');
  log(`Project: ${projectName}`, 'blue');
  log(`Type: ${scenario.type}`, 'blue');
  log(`Timeout: ${scenario.timeout}s`, 'blue');

  try {
    // Cleanup before test
    await cleanupProject(projectName);
    log('\n✓ Cleaned up existing project', 'green');

    // Run the CLI
    await new Promise((resolve, reject) => {
      const child = spawn('node', ['bin/index.js'], {
        cwd: __dirname,
        stdio: ['pipe', 'inherit', 'inherit'],
        shell: true,
      });

      let answerIndex = 0;
      let buffer = '';
      let answered = false;

      // Set up periodic answer sending
      const answerInterval = setInterval(() => {
        if (answerIndex < scenario.answers.length && !answered) {
          child.stdin.write(`${scenario.answers[answerIndex]}\n`);
          answerIndex++;
          answered = true;
          setTimeout(() => {
            answered = false;
          }, 500);
        }
      }, 1000);

      child.on('close', (code) => {
        clearInterval(answerInterval);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      child.on('error', (err) => {
        clearInterval(answerInterval);
        reject(err);
      });

      // Timeout
      setTimeout(() => {
        clearInterval(answerInterval);
        child.kill();
        reject(new Error(`Test timed out after ${scenario.timeout}s`));
      }, scenario.timeout * 1000);
    });

    // Verify project was created
    const stats = await fs.stat(projectPath);
    if (!stats.isDirectory()) {
      throw new Error('Project directory was not created');
    }
    log('\n✓ Project directory created', 'green');

    // Verify required files
    const verificationResults = await verifyFiles(projectPath, scenario.verify);
    const allFilesExist = verificationResults.every((r) => r.exists);

    if (allFilesExist) {
      log('✓ All required files exist:', 'green');
      verificationResults.forEach((r) => log(`  ✓ ${r.file}`, 'green'));
    } else {
      log('⚠ Some files missing:', 'yellow');
      verificationResults.forEach((r) => {
        if (r.exists) {
          log(`  ✓ ${r.file}`, 'green');
        } else {
          log(`  ✗ ${r.file}`, 'red');
        }
      });
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`\n✅ SUCCESS: ${scenario.name} (${duration}s)`, 'green');

    return {
      success: true,
      scenario,
      duration,
      allFilesExist,
      verificationResults,
    };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`\n❌ FAILED: ${scenario.name} (${duration}s)`, 'red');
    log(`Error: ${error.message}`, 'red');

    return {
      success: false,
      scenario,
      duration,
      error: error.message,
      allFilesExist: false,
    };
  }
}

async function main() {
  const startTime = Date.now();

  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     🚀 InitKit Comprehensive Test Suite 🚀                ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  log(`\nTesting ${testScenarios.length} scenarios covering all edge cases...\n`, 'bright');

  // Parse command line args
  const args = process.argv.slice(2);
  const specificTest = args[0] ? parseInt(args[0]) : null;

  let scenariosToRun = testScenarios;
  if (specificTest !== null && specificTest > 0 && specificTest <= testScenarios.length) {
    scenariosToRun = [testScenarios[specificTest - 1]];
    log(`Running only test #${specificTest}: ${scenariosToRun[0].name}\n`, 'yellow');
  }

  const results = [];

  for (let i = 0; i < scenariosToRun.length; i++) {
    const result = await runTest(
      scenariosToRun[i],
      specificTest !== null ? specificTest - 1 : i,
      specificTest !== null ? testScenarios.length : scenariosToRun.length
    );
    results.push(result);

    // Small delay between tests
    if (i < scenariosToRun.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Print summary
  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

  log('\n' + '='.repeat(80), 'cyan');
  log('📊 TEST SUMMARY', 'bright');
  log('='.repeat(80), 'cyan');

  const passed = results.filter((r) => r.success && r.allFilesExist);
  const passedWithWarnings = results.filter((r) => r.success && !r.allFilesExist);
  const failed = results.filter((r) => !r.success);

  log(`\nTotal Tests: ${results.length}`, 'bright');
  log(`✅ Passed: ${passed.length}`, 'green');
  log(`⚠️  Passed with warnings: ${passedWithWarnings.length}`, 'yellow');
  log(`❌ Failed: ${failed.length}`, 'red');
  log(`⏱️  Total Time: ${totalDuration}s`, 'blue');

  if (passed.length > 0) {
    log('\n✅ Passed Tests:', 'green');
    passed.forEach((r, i) => {
      log(`  ${i + 1}. ${r.scenario.name} (${r.duration}s)`, 'green');
    });
  }

  if (passedWithWarnings.length > 0) {
    log('\n⚠️  Passed with Warnings:', 'yellow');
    passedWithWarnings.forEach((r, i) => {
      log(`  ${i + 1}. ${r.scenario.name} (${r.duration}s)`, 'yellow');
      r.verificationResults
        .filter((v) => !v.exists)
        .forEach((v) => {
          log(`     Missing: ${v.file}`, 'yellow');
        });
    });
  }

  if (failed.length > 0) {
    log('\n❌ Failed Tests:', 'red');
    failed.forEach((r, i) => {
      log(`  ${i + 1}. ${r.scenario.name} (${r.duration}s)`, 'red');
      log(`     Error: ${r.error}`, 'red');
    });
  }

  log('\n' + '='.repeat(80), 'cyan');
  log('Test Coverage:', 'bright');
  log(`  Frontend Tests: ${results.filter((r) => r.scenario.type === 'frontend').length}`, 'blue');
  log(`  Backend Tests: ${results.filter((r) => r.scenario.type === 'backend').length}`, 'blue');
  log(`  Package Managers: npm, yarn, pnpm, bun`, 'blue');
  log(`  Frameworks: React, Next.js, Vue, Express`, 'blue');
  log(`  Styling: Tailwind, Sass, Styled Components, Emotion, CSS`, 'blue');
  log(`  UI Libraries: shadcn, Material-UI, Chakra UI, Mantine, DaisyUI`, 'blue');
  log('='.repeat(80), 'cyan');

  process.exit(failed.length > 0 ? 1 : 0);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log(`\n❌ Unhandled error: ${error.message}`, 'red');
  process.exit(1);
});

main().catch((error) => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
