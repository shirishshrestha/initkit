#!/usr/bin/env node

/**
 * Test Tailwind CSS Edge Cases
 * Tests Tailwind installation with different frameworks and package managers
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tailwindTests = [
  {
    name: 'React+Tailwind+pnpm',
    framework: 'React + Vite',
    pm: 'pnpm',
  },
  {
    name: 'React+Tailwind+yarn',
    framework: 'React + Vite',
    pm: 'yarn',
  },
  {
    name: 'React+Tailwind+bun',
    framework: 'React + Vite',
    pm: 'bun',
  },
  {
    name: 'Next.js+Tailwind+pnpm',
    framework: 'Next.js',
    pm: 'pnpm',
  },
  {
    name: 'Vue+Tailwind+yarn',
    framework: 'Vue',
    pm: 'yarn',
  },
];

async function testTailwind(test) {
  const projectName = `test-tw-${test.pm}-${test.framework.toLowerCase().replace(/[^a-z]/g, '')}`;
  const projectPath = path.join(__dirname, projectName);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 ${test.name}`);
  console.log('='.repeat(60));

  try {
    await fs.rm(projectPath, { recursive: true, force: true });

    const answers = [
      'Frontend Only',
      projectName,
      test.framework,
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
      test.pm,
      'No',
    ];

    await new Promise((resolve, reject) => {
      const child = spawn('node', ['bin/index.js'], {
        cwd: __dirname,
        stdio: ['pipe', 'inherit', 'inherit'],
        shell: true,
      });

      let answerIndex = 0;
      const answerInterval = setInterval(() => {
        if (answerIndex < answers.length) {
          child.stdin.write(`${answers[answerIndex]}\n`);
          answerIndex++;
        }
      }, 1000);

      child.on('close', (code) => {
        clearInterval(answerInterval);
        if (code === 0) resolve();
        else reject(new Error(`Exit code ${code}`));
      });

      setTimeout(() => {
        clearInterval(answerInterval);
        child.kill();
        reject(new Error('Timeout'));
      }, 180000);
    });

    // Verify Tailwind files
    await fs.access(path.join(projectPath, 'tailwind.config.js'));
    await fs.access(path.join(projectPath, 'postcss.config.js'));

    console.log(`\n✅ ${test.name} PASSED\n`);
    return { test, success: true };
  } catch (error) {
    console.error(`\n❌ ${test.name} FAILED: ${error.message}\n`);
    return { test, success: false, error: error.message };
  }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  Tailwind CSS Edge Case Testing                    ║');
  console.log('║  All frameworks + All package managers             ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  const results = [];
  for (const test of tailwindTests) {
    const result = await testTailwind(test);
    results.push(result);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  results.forEach((r) => {
    const status = r.success ? '✅' : '❌';
    console.log(`${status} ${r.test.name}: ${r.success ? 'PASSED' : r.error}`);
  });

  const allPassed = results.every((r) => r.success);
  process.exit(allPassed ? 0 : 1);
}

main();
