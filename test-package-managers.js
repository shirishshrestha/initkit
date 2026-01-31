#!/usr/bin/env node

/**
 * Test Package Manager Edge Cases
 * Tests the same configuration with all 4 package managers
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageManagers = ['npm', 'yarn', 'pnpm', 'bun'];

async function testPackageManager(pm) {
  const projectName = `test-pm-${pm}`;
  const projectPath = path.join(__dirname, projectName);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Testing with ${pm.toUpperCase()}`);
  console.log('='.repeat(60));

  try {
    // Cleanup
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
      pm,
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
    const files = ['tailwind.config.js', 'postcss.config.js', 'src/index.css'];
    for (const file of files) {
      await fs.access(path.join(projectPath, file));
    }

    console.log(`\n✅ ${pm.toUpperCase()} test PASSED\n`);
    return { pm, success: true };
  } catch (error) {
    console.error(`\n❌ ${pm.toUpperCase()} test FAILED: ${error.message}\n`);
    return { pm, success: false, error: error.message };
  }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  Package Manager Edge Case Testing                 ║');
  console.log('║  Testing: npm, yarn, pnpm, bun                      ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  const results = [];
  for (const pm of packageManagers) {
    const result = await testPackageManager(pm);
    results.push(result);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  results.forEach((r) => {
    const status = r.success ? '✅' : '❌';
    console.log(`${status} ${r.pm}: ${r.success ? 'PASSED' : `FAILED - ${r.error}`}`);
  });

  const allPassed = results.every((r) => r.success);
  process.exit(allPassed ? 0 : 1);
}

main();
