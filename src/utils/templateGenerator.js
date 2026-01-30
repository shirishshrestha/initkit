import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateNextjsTemplate } from '../templates/nextjs.js';
import { generateReactTemplate } from '../templates/react.js';
import { generateVueTemplate } from '../templates/vue.js';
import generateExpressTemplate from '../templates/express.js';
import { generateFullStackTemplate } from '../templates/fullstack.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate project files from templates based on user configuration
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration object
 * @param {string} config.projectType - Type of project ('frontend'|'backend'|'fullstack'|'library')
 * @param {string} [config.frontend] - Frontend framework choice
 * @param {string} [config.backend] - Backend framework choice
 * @param {Array<string>} [config.features] - Additional features to enable
 * @returns {Promise<void>}
 * @throws {Error} If template generation fails
 */
async function generateTemplate(projectPath, config) {
  // Generate .gitignore
  await generateGitignore(projectPath, config);

  // Generate project-specific files based on type
  switch (config.projectType) {
    case 'frontend':
      await generateFrontendFiles(projectPath, config);
      break;
    case 'backend':
      await generateBackendFiles(projectPath, config);
      break;
    case 'fullstack':
      await generateFullStackFiles(projectPath, config);
      break;
    case 'library':
      await generateLibraryFiles(projectPath, config);
      break;
  }

  // Add additional features (Docker, GitHub Actions, etc.)
  if (config.features) {
    await addFeatures(projectPath, config);
  }
}

/**
 * Generate frontend project files based on selected framework
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration
 * @param {string} config.frontend - Frontend framework ('react'|'vue'|'nextjs'|'angular'|'svelte'|'nuxt')
 * @param {string} config.language - Language choice ('typescript'|'javascript')
 * @param {string} config.folderStructure - Folder structure preference
 * @returns {Promise<void>}
 * @throws {Error} If framework template is not found or generation fails
 */
async function generateFrontendFiles(projectPath, config) {
  const framework = config.frontend;

  switch (framework) {
    case 'nextjs':
      await generateNextjsTemplate(projectPath, config);
      break;
    case 'react':
      await generateReactTemplate(projectPath, config);
      break;
    case 'vue':
      await generateVueTemplate(projectPath, config);
      break;
    case 'angular':
      await generateAngularTemplate(projectPath, config);
      break;
    case 'svelte':
      await generateSvelteTemplate(projectPath, config);
      break;
    case 'vanilla':
      await generateVanillaTemplate(projectPath, config);
      break;
    default:
      // Fallback to basic structure
      await generateBasicFrontend(projectPath, config);
  }
}

// Vue template is now imported from vue.js

async function generateAngularTemplate(projectPath, config) {
  // TODO: Implement Angular template
  console.log('Angular template generation - coming soon');
  await generateBasicFrontend(projectPath, config);
}

async function generateSvelteTemplate(projectPath, config) {
  // TODO: Implement Svelte template
  console.log('Svelte template generation - coming soon');
  await generateBasicFrontend(projectPath, config);
}

async function generateVanillaTemplate(projectPath, config) {
  // TODO: Implement Vanilla JS template
  console.log('Vanilla JS template generation - coming soon');
  await generateBasicFrontend(projectPath, config);
}

async function generateBasicFrontend(projectPath, config) {
  // Basic fallback structure
  await fs.ensureDir(path.join(projectPath, 'src'));
  await fs.ensureDir(path.join(projectPath, 'public'));

  const packageJson = {
    name: config.projectName,
    version: '1.0.0',
    description: `${config.frontend} project`,
    scripts: {
      dev: 'echo "Configure your dev script"',
      build: 'echo "Configure your build script"',
    },
    keywords: [],
    author: '',
    license: 'MIT',
  };

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

  const readme = `# ${config.projectName}

Created with InitKit CLI

## Getting Started

\`\`\`bash
${config.packageManager} install
${config.packageManager} ${config.packageManager === 'npm' ? 'run ' : ''}dev
\`\`\`

---

Built with InitKit
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

/**
 * Generate backend project files based on selected framework
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration
 * @param {string} config.backend - Backend framework ('express'|'fastify'|'nestjs'|'koa'|'hapi')
 * @param {string} [config.database] - Database choice ('mongodb'|'postgresql'|'mysql'|'sqlite')
 * @param {string} config.language - Language choice ('typescript'|'javascript')
 * @param {string} config.projectName - Name of the project
 * @param {string} config.packageManager - Package manager to use
 * @returns {Promise<void>}
 * @throws {Error} If backend template generation fails
 */
async function generateBackendFiles(projectPath, config) {
  const backend = config.backend;

  switch (backend) {
    case 'express':
      await generateExpressTemplate(projectPath, config);
      break;
    case 'fastify':
      await generateFastifyTemplate(projectPath, config);
      break;
    case 'nestjs':
      await generateNestjsTemplate(projectPath, config);
      break;
    default:
      // Fallback to basic structure
      await generateBasicBackend(projectPath, config);
  }
}

async function generateFastifyTemplate(projectPath, config) {
  // TODO: Implement Fastify template
  console.log('Fastify template generation - coming soon');
  await generateBasicBackend(projectPath, config);
}

async function generateNestjsTemplate(projectPath, config) {
  // TODO: Implement NestJS template
  console.log('NestJS template generation - coming soon');
  await generateBasicBackend(projectPath, config);
}

async function generateBasicBackend(projectPath, config) {
  // Create backend-specific files based on chosen framework
  const srcPath = path.join(projectPath, 'src');
  await fs.ensureDir(srcPath);

  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const serverContent = `// ${config.backend} server\n\nconst PORT = process.env.PORT || 3000;\n\nconsole.log(\`Server starting on port \${PORT}\`);\n`;

  await fs.writeFile(path.join(srcPath, `server.${ext}`), serverContent);

  // Basic package.json
  const packageJson = {
    name: config.projectName,
    version: '1.0.0',
    description: `${config.backend} backend`,
    main: `src/server.${ext}`,
    scripts: {
      dev: 'node src/server.js',
      start: 'node src/server.js',
    },
    keywords: [],
    author: '',
    license: 'MIT',
  };

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

  const readme = `# ${config.projectName}

Created with InitKit CLI

## Getting Started

\`\`\`bash
${config.packageManager} install
${config.packageManager} ${config.packageManager === 'npm' ? 'run ' : ''}dev
\`\`\`

---

Built with InitKit
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

/**
 * Generate full-stack project with both frontend and backend
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration
 * @param {string} [config.fullstackType] - Project structure type ('monorepo'|'traditional')
 * @param {string} [config.stack] - Technology stack ('MERN'|'PERN'|'T3'|etc)
 * @param {string} [config.frontend] - Frontend framework
 * @param {string} [config.backend] - Backend framework
 * @returns {Promise<void>}
 * @throws {Error} If full-stack template generation fails
 */
async function generateFullStackFiles(projectPath, config) {
  // Use the dedicated full-stack template generator
  await generateFullStackTemplate(projectPath, config);
}

/**
 * Generate Node.js library/package structure
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration
 * @param {string} config.projectName - Name of the library
 * @param {string} config.language - Language choice ('typescript'|'javascript')
 * @param {string} config.packageManager - Package manager to use
 * @returns {Promise<void>}
 * @throws {Error} If library template generation fails
 */
async function generateLibraryFiles(projectPath, config) {
  const srcPath = path.join(projectPath, 'src');
  await fs.ensureDir(srcPath);

  const ext = config.language === 'typescript' ? 'ts' : 'js';

  const indexContent = `/**
 * Main entry point for ${config.projectName}
 */

export function hello() {
  return 'Hello from ${config.projectName}!';
}
`;

  await fs.writeFile(path.join(srcPath, `index.${ext}`), indexContent);

  // Package.json for library
  const packageJson = {
    name: config.projectName,
    version: '1.0.0',
    description: 'A reusable library',
    main: `dist/index.js`,
    types: config.language === 'typescript' ? 'dist/index.d.ts' : undefined,
    files: ['dist'],
    scripts: {
      build: 'echo "Configure build script"',
      test: 'echo "Configure test script"',
    },
    keywords: [],
    author: '',
    license: 'MIT',
  };

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

  const readme = `# ${config.projectName}

Library created with InitKit CLI

## Installation

\`\`\`bash
npm install ${config.projectName}
\`\`\`

## Usage

\`\`\`javascript
import { hello } from '${config.projectName}';

console.log(hello());
\`\`\`

---

Built with InitKit
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

/**
 * Generate .gitignore file with framework-specific patterns
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration
 * @param {string} config.projectType - Type of project ('frontend'|'backend'|'fullstack'|'library')
 * @param {string} [config.frontend] - Frontend framework name
 * @param {string} [config.backend] - Backend framework name
 * @param {boolean} [config.monorepo] - Whether project uses monorepo structure
 * @returns {Promise<void>}
 * @throws {Error} If file creation fails
 */
async function generateGitignore(projectPath, config) {
  const gitignore = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/
.next/
out/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Local env files
.env
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
}

/**
 * Add additional features to the project (Docker, CI/CD, Git hooks)
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration
 * @param {Array<string>} config.features - List of features to add (e.g., ['docker', 'github-actions', 'husky'])
 * @returns {Promise<void>}
 */
async function addFeatures(projectPath, config) {
  const features = config.features || [];

  // Docker configuration
  if (features.includes('docker')) {
    await generateDockerFiles(projectPath, config);
  }

  // GitHub Actions
  if (features.includes('github-actions')) {
    await generateGitHubActions(projectPath, config);
  }

  // Husky
  if (features.includes('husky')) {
    await generateHuskyFiles(projectPath, config);
  }
}

/**
 * Generate Docker configuration files (Dockerfile and .dockerignore)
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration
 * @returns {Promise<void>}
 */
async function generateDockerFiles(projectPath, config) {
  const dockerfile = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`;

  await fs.writeFile(path.join(projectPath, 'Dockerfile'), dockerfile);

  const dockerignore = `node_modules
.git
.env
npm-debug.log
`;

  await fs.writeFile(path.join(projectPath, '.dockerignore'), dockerignore);
}

/**
 * Generate GitHub Actions CI/CD workflow
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration
 * @returns {Promise<void>}
 */
async function generateGitHubActions(projectPath, config) {
  await fs.ensureDir(path.join(projectPath, '.github', 'workflows'));

  const workflow = `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run lint
      run: npm run lint
      
    - name: Run tests
      run: npm test
`;

  await fs.writeFile(path.join(projectPath, '.github', 'workflows', 'ci.yml'), workflow);
}

/**
 * Generate Husky Git hooks for pre-commit linting
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration
 * @returns {Promise<void>}
 */
async function generateHuskyFiles(projectPath, config) {
  await fs.ensureDir(path.join(projectPath, '.husky'));

  const preCommit = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
`;

  await fs.writeFile(path.join(projectPath, '.husky', 'pre-commit'), preCommit);
}

export { generateTemplate };
