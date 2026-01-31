#!/usr/bin/env node

/**
 * Test Backend & ORM Edge Cases
 * Tests Prisma, Drizzle, Mongoose with different package managers
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendTests = [
  {
    name: 'Express+Prisma+PostgreSQL+pnpm',
    orm: 'Prisma',
    db: 'PostgreSQL',
    pm: 'pnpm',
    verifyFile: 'prisma/schema.prisma',
  },
  {
    name: 'Express+Prisma+MySQL+yarn',
    orm: 'Prisma',
    db: 'MySQL',
    pm: 'yarn',
    verifyFile: 'prisma/schema.prisma',
  },
  {
    name: 'Express+Drizzle+PostgreSQL+bun',
    orm: 'Drizzle',
    db: 'PostgreSQL',
    pm: 'bun',
    verifyFile: 'package.json',
  },
  {
    name: 'Express+Mongoose+MongoDB+npm',
    orm: 'Mongoose',
    db: 'MongoDB',
    pm: 'npm',
    verifyFile: 'package.json',
  },
];

async function testBackend(test) {
  const projectName = `test-backend-${test.pm}-${test.orm.toLowerCase()}`;
  const projectPath = path.join(__dirname, projectName);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 ${test.name}`);
  console.log('='.repeat(60));

  try {
    await fs.rm(projectPath, { recursive: true, force: true });

    const answers = [
      'Backend Only',
      projectName,
      'Express',
      'TypeScript',
      'Feature-based (Organize by feature/module)',
      test.orm,
      test.db,
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

    // Verify files
    await fs.access(path.join(projectPath, test.verifyFile));
    await fs.access(path.join(projectPath, 'package.json'));

    console.log(`\n✅ ${test.name} PASSED\n`);
    return { test, success: true };
  } catch (error) {
    console.error(`\n❌ ${test.name} FAILED: ${error.message}\n`);
    return { test, success: false, error: error.message };
  }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  Backend & ORM Edge Case Testing                   ║');
  console.log('║  Prisma, Drizzle, Mongoose + All PMs               ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  const results = [];
  for (const test of backendTests) {
    const result = await testBackend(test);
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
