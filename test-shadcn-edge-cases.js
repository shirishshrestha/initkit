#!/usr/bin/env node

/**
 * Test shadcn/ui Edge Cases
 * Tests shadcn installation with different package managers
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const shadcnTests = [
  { name: 'shadcn+npm', pm: 'npm' },
  { name: 'shadcn+yarn', pm: 'yarn' },
  { name: 'shadcn+pnpm', pm: 'pnpm' },
  { name: 'shadcn+bun', pm: 'bun' },
];

async function testShadcn(test) {
  const projectName = `test-shadcn-${test.pm}`;
  const projectPath = path.join(__dirname, projectName);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Testing shadcn/ui with ${test.pm.toUpperCase()}`);
  console.log('='.repeat(60));

  try {
    await fs.rm(projectPath, { recursive: true, force: true });

    const answers = [
      'Frontend Only',
      projectName,
      'React + Vite',
      'TypeScript (Recommended)',
      'Feature-based (Organize by feature/module)',
      'Strict (Recommended for new projects)',
      'Tailwind CSS',
      'None',
      'shadcn/ui (Radix + Tailwind)',
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
      }, 200000);
    });

    // Verify shadcn setup
    await fs.access(path.join(projectPath, 'tailwind.config.js'));
    await fs.access(path.join(projectPath, 'tsconfig.json'));
    await fs.access(path.join(projectPath, 'postcss.config.js'));

    // Check tsconfig has path alias
    const tsconfig = JSON.parse(
      await fs.readFile(path.join(projectPath, 'tsconfig.json'), 'utf-8')
    );
    if (!tsconfig.compilerOptions?.paths?.['@/*']) {
      throw new Error('tsconfig missing @/* path alias');
    }

    console.log(`\n✅ ${test.name} PASSED\n`);
    return { test, success: true };
  } catch (error) {
    console.error(`\n❌ ${test.name} FAILED: ${error.message}\n`);
    return { test, success: false, error: error.message };
  }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  shadcn/ui Edge Case Testing                       ║');
  console.log('║  Tests installation with all package managers      ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  const results = [];
  for (const test of shadcnTests) {
    const result = await testShadcn(test);
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
