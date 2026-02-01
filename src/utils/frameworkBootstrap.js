import path from 'path';
import { execCommand } from './cliRunner.js';
import chalk from 'chalk';

/**
 * Bootstrap a project using official framework CLIs
 *
 * This function delegates project creation to official framework CLIs
 * instead of manually creating files. This ensures we always use the
 * latest best practices and configurations from framework maintainers.
 *
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User configuration object
 * @returns {Promise<void>}
 */
export async function bootstrapWithOfficialCLI(projectPath, config) {
  const { projectType, frontend: _frontend, backend: _backend } = config;

  switch (projectType) {
    case 'frontend':
      return bootstrapFrontend(projectPath, config);

    case 'backend':
      return bootstrapBackend(projectPath, config);

    case 'library':
      return bootstrapLibrary(projectPath, config);

    default:
      throw new Error(`Unsupported project type: ${projectType}`);
  }
}

/**
 * Bootstrap a frontend project
 */
async function bootstrapFrontend(projectPath, config) {
  const { frontend } = config;

  switch (frontend) {
    case 'nextjs':
      return bootstrapNextjs(projectPath, config);

    case 'react':
      return bootstrapReact(projectPath, config);

    case 'vue':
      return bootstrapVue(projectPath, config);

    case 'nuxt':
      return bootstrapNuxt(projectPath, config);

    case 'svelte':
      return bootstrapSvelte(projectPath, config);

    default:
      throw new Error(`Unsupported frontend framework: ${frontend}`);
  }
}

/**
 * Bootstrap a backend project
 */
async function bootstrapBackend(projectPath, config) {
  const { backend } = config;

  switch (backend) {
    case 'express':
      return bootstrapExpress(projectPath, config);

    case 'nestjs':
      return bootstrapNestJS(projectPath, config);

    case 'fastify':
      return bootstrapFastify(projectPath, config);

    default:
      throw new Error(`Unsupported backend framework: ${backend}`);
  }
}

// ============================================
// Frontend Framework Bootstrappers
// ============================================

/**
 * Bootstrap Next.js project using create-next-app
 *
 * @param {string} projectPath - Absolute path to project
 * @param {Object} config - Configuration object
 */
export async function bootstrapNextjs(projectPath, config) {
  const { language, styling, packageManager = 'npm' } = config;
  const projectName = path.basename(projectPath);
  const parentDir = path.dirname(projectPath);

  console.log(chalk.cyan(`\n📦 Creating Next.js project...`));
  console.log(
    chalk.gray(`   Language: ${language === 'typescript' ? 'TypeScript' : 'JavaScript'}`)
  );
  console.log(chalk.gray(`   Styling: ${styling || 'CSS'}`));
  console.log(chalk.gray(`   Package Manager: ${packageManager}\n`));

  const args = ['create-next-app@latest', projectName];

  // Language
  if (language === 'typescript') {
    args.push('--typescript');
  } else {
    args.push('--javascript');
  }

  // Styling - check if user wants Tailwind
  if (styling === 'tailwind' || styling === 'tailwindcss') {
    args.push('--tailwind');
  } else {
    args.push('--no-tailwind');
  }

  // Default options
  args.push('--eslint'); // Always include ESLint
  args.push('--app'); // Use App Router
  args.push('--src-dir'); // Use src directory
  args.push('--import-alias', '@/*'); // Set import alias
  args.push('--no-git'); // We handle git separately

  // Package manager
  args.push(`--use-${packageManager}`);

  // Skip installation - we'll install add-ons after
  args.push('--skip-install');

  console.log(chalk.dim(`   Command: npx ${args.join(' ')}\n`));

  await execCommand(`npx ${args.join(' ')}`, {
    cwd: parentDir,
  });
}

/**
 * Bootstrap React project using Vite
 *
 * @param {string} projectPath - Absolute path to project
 * @param {Object} config - Configuration object
 */
export async function bootstrapReact(projectPath, config) {
  const { language = 'typescript', packageManager = 'npm' } = config;
  const projectName = path.basename(projectPath);
  const parentDir = path.dirname(projectPath);
  const template = language === 'typescript' ? 'react-ts' : 'react';

  console.log(chalk.cyan(`\n📦 Creating React project with Vite...`));
  console.log(
    chalk.gray(`   Language: ${language === 'typescript' ? 'TypeScript' : 'JavaScript'}`)
  );
  console.log(chalk.gray(`   Template: ${template}`));
  console.log(chalk.gray(`   Package Manager: ${packageManager}\n`));

  // Use create-vite 5.1.0 which is more stable and doesn't auto-start dev server
  // The --template flag should make it non-interactive
  const command = `npx create-vite@5.1.0 ${projectName} --template ${template}`;
  console.log(chalk.dim(`   Command: ${command}\n`));

  await execCommand(command, {
    cwd: parentDir,
  });
}

/**
 * Bootstrap Vue project
 *
 * @param {string} projectPath - Absolute path to project
 * @param {Object} config - Configuration object
 */
export async function bootstrapVue(projectPath, config) {
  const { language = 'typescript', packageManager = 'npm' } = config;
  const projectName = path.basename(projectPath);
  const parentDir = path.dirname(projectPath);

  console.log(chalk.cyan(`\n📦 Creating Vue project...`));
  console.log(
    chalk.gray(`   Language: ${language === 'typescript' ? 'TypeScript' : 'JavaScript'}`)
  );
  console.log(chalk.gray(`   Package Manager: ${packageManager}\n`));

  // Use --typescript and --default flags to create non-interactive TypeScript project
  const flags = language === 'typescript' ? '--typescript --default' : '--default';
  const command = `npm create vue@latest ${projectName} -- ${flags}`;
  console.log(chalk.dim(`   Command: ${command}\n`));

  await execCommand(command, { cwd: parentDir });
}

/**
 * Bootstrap Nuxt project
 *
 * @param {string} projectPath - Absolute path to project
 * @param {Object} config - Configuration object
 */
export async function bootstrapNuxt(projectPath, config) {
  const { packageManager = 'npm' } = config;
  const projectName = path.basename(projectPath);
  const parentDir = path.dirname(projectPath);

  console.log(chalk.cyan(`\n📦 Creating Nuxt project...`));
  console.log(chalk.gray(`   Package Manager: ${packageManager}\n`));

  const command = `npx nuxi@latest init ${projectName} --packageManager ${packageManager}`;
  console.log(chalk.dim(`   Command: ${command}\n`));

  await execCommand(command, { cwd: parentDir });
}

/**
 * Bootstrap Svelte project
 *
 * @param {string} projectPath - Absolute path to project
 * @param {Object} config - Configuration object
 */
export async function bootstrapSvelte(projectPath, config) {
  const { packageManager = 'npm' } = config;
  const projectName = path.basename(projectPath);
  const parentDir = path.dirname(projectPath);

  console.log(chalk.cyan(`\n📦 Creating Svelte project...`));
  console.log(chalk.gray(`   Package Manager: ${packageManager}\n`));

  const command = `npm create svelte@latest ${projectName} -y`;
  console.log(chalk.dim(`   Command: ${command}\n`));

  await execCommand(command, { cwd: parentDir });
}

// ============================================
// Backend Framework Bootstrappers
// ============================================

/**
 * Bootstrap Express project
 *
 * @param {string} projectPath - Absolute path to project
 * @param {Object} config - Configuration object
 */
export async function bootstrapExpress(projectPath, config) {
  const { language } = config;
  const projectName = path.basename(projectPath);
  const parentDir = path.dirname(projectPath);

  console.log(chalk.cyan(`\n📦 Creating Express project...`));
  console.log(
    chalk.gray(`   Language: ${language === 'typescript' ? 'TypeScript' : 'JavaScript'}\n`)
  );

  // Express doesn't have a modern CLI, so we'll use express-generator
  const command = `npx express-generator --no-view --git ${projectName}`;
  console.log(chalk.dim(`   Command: ${command}\n`));

  await execCommand(command, { cwd: parentDir });

  // If TypeScript, we'll need to convert it later in the template generator
  if (language === 'typescript') {
    console.log(chalk.yellow('   TypeScript setup will be added in the next step...\n'));
  }
}

/**
 * Bootstrap NestJS project
 *
 * @param {string} projectPath - Absolute path to project
 * @param {Object} config - Configuration object
 */
export async function bootstrapNestJS(projectPath, config) {
  const { packageManager = 'npm' } = config;
  const projectName = path.basename(projectPath);
  const parentDir = path.dirname(projectPath);

  console.log(chalk.cyan(`\n📦 Creating NestJS project...`));
  console.log(chalk.gray(`   Language: TypeScript (NestJS default)`));
  console.log(chalk.gray(`   Package Manager: ${packageManager}\n`));

  const command = `npx @nestjs/cli new ${projectName} --package-manager ${packageManager} --skip-git --skip-install`;
  console.log(chalk.dim(`   Command: ${command}\n`));

  await execCommand(command, { cwd: parentDir });
}

/**
 * Bootstrap Fastify project
 *
 * @param {string} projectPath - Absolute path to project
 * @param {Object} config - Configuration object
 */
export async function bootstrapFastify(projectPath, config) {
  const { language = 'javascript' } = config;
  const projectName = path.basename(projectPath);
  const parentDir = path.dirname(projectPath);

  console.log(chalk.cyan(`\n📦 Creating Fastify project...`));
  console.log(
    chalk.gray(`   Language: ${language === 'typescript' ? 'TypeScript' : 'JavaScript'}\n`)
  );

  const command = `npx fastify-cli generate ${projectName}`;
  console.log(chalk.dim(`   Command: ${command}\n`));

  await execCommand(command, { cwd: parentDir });
}

/**
 * Bootstrap Library/Package project
 * Creates a basic npm package structure with TypeScript/JavaScript support
 *
 * @param {string} projectPath - Absolute path to project
 * @param {Object} config - Configuration object
 */
export async function bootstrapLibrary(projectPath, config) {
  const { language = 'typescript', packageManager = 'npm' } = config;
  const projectName = path.basename(projectPath);

  console.log(chalk.cyan(`\n📦 Creating Library/Package project...`));
  console.log(
    chalk.gray(`   Language: ${language === 'typescript' ? 'TypeScript' : 'JavaScript'}`)
  );
  console.log(chalk.gray(`   Package Manager: ${packageManager}\n`));

  // Create basic directory structure
  const fsExtra = await import('fs-extra');
  const fs = fsExtra.default;

  // Create project directory
  await fs.ensureDir(projectPath);

  // Create src directory
  await fs.ensureDir(path.join(projectPath, 'src'));

  // Create package.json
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    description: 'A new library/package',
    main: language === 'typescript' ? 'dist/index.js' : 'src/index.js',
    types: language === 'typescript' ? 'dist/index.d.ts' : undefined,
    scripts: {
      ...(language === 'typescript' && {
        build: 'tsc',
        'build:watch': 'tsc --watch',
        prepublishOnly: 'npm run build',
      }),
      test: 'echo "Error: no test specified" && exit 1',
    },
    keywords: [],
    author: '',
    license: 'MIT',
  };

  await fs.outputFile(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

  // Create basic entry file
  const ext = language === 'typescript' ? 'ts' : 'js';
  const indexContent =
    language === 'typescript'
      ? `/**
 * Main entry point for the library
 */

export function hello(name: string): string {
  return \`Hello, \${name}!\`;
}

export default {
  hello,
};
`
      : `/**
 * Main entry point for the library
 */

export function hello(name) {
  return \`Hello, \${name}!\`;
}

export default {
  hello,
};
`;

  await fs.outputFile(path.join(projectPath, 'src', `index.${ext}`), indexContent);

  // Create TypeScript config if needed
  if (language === 'typescript') {
    const tsconfig = {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        moduleResolution: 'node',
        declaration: true,
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist'],
    };

    await fs.outputFile(path.join(projectPath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
  }

  // Create README
  const readme = `# ${projectName}

A new library/package

## Installation

\`\`\`bash
npm install ${projectName}
\`\`\`

## Usage

\`\`\`${language === 'typescript' ? 'typescript' : 'javascript'}
import { hello } from '${projectName}';

console.log(hello('World')); // Hello, World!
\`\`\`

## License

MIT
`;

  await fs.outputFile(path.join(projectPath, 'README.md'), readme);

  console.log(chalk.green('✓ Library project structure created'));
}
