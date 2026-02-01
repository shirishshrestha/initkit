import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Generate project files from templates based on user configuration
 *
 * NOTE: With the new CLI-first approach, this function now focuses on
 * ENHANCING the project created by official CLIs rather than creating
 * everything from scratch. It adds custom folder structures on top of
 * the base project.
 *
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration object
 * @param {string} config.projectType - Type of project ('frontend'|'backend'|'library')
 * @param {string} [config.frontend] - Frontend framework choice
 * @param {string} [config.backend] - Backend framework choice
 * @param {string} [config.folderStructure] - Folder structure preference
 * @param {Array<string>} [config.features] - Additional features to enable
 * @returns {Promise<void>}
 * @throws {Error} If template generation fails
 */
async function generateTemplate(projectPath, config) {
  console.log(chalk.dim('\n  Adding custom folder structure...\n'));

  // Add custom folder structure based on project type
  switch (config.projectType) {
    case 'frontend':
      await enhanceFrontendStructure(projectPath, config);
      break;
    case 'backend':
      await enhanceBackendStructure(projectPath, config);
      break;
    case 'library':
      await enhanceLibraryStructure(projectPath, config);
      break;
    default:
      console.log(chalk.gray('  ✓ Using default project structure'));
  }

  // Add additional features (Docker, GitHub Actions, etc.)
  if (config.features) {
    await addFeatures(projectPath, config);
  }

  // Generate .env example files if needed
  if (config.features && config.features.includes('dotenv')) {
    await generateEnvFiles(projectPath, config);
  }
}

/**
 * Enhance frontend project with custom folder structure
 * Adds folders on top of CLI-generated project
 */
async function enhanceFrontendStructure(projectPath, config) {
  const { folderStructure = 'feature-based' } = config;
  const srcPath = path.join(projectPath, 'src');

  // Ensure src directory exists (should already exist from CLI)
  await fs.ensureDir(srcPath);

  switch (folderStructure) {
    case 'feature-based':
      await createFeatureBasedStructure(srcPath, config);
      break;
    case 'component-based':
      await createComponentBasedStructure(srcPath, config);
      break;
    case 'atomic':
      await createAtomicStructure(srcPath, config);
      break;
    default:
      await createFeatureBasedStructure(srcPath, config);
  }

  console.log(chalk.gray(`  ✓ Added ${folderStructure} folder structure`));
}

/**
 * Create feature-based folder structure
 */
async function createFeatureBasedStructure(srcPath, config) {
  const features = ['auth', 'dashboard', 'users'];

  for (const feature of features) {
    await fs.ensureDir(path.join(srcPath, 'features', feature, 'components'));
    await fs.ensureDir(path.join(srcPath, 'features', feature, 'hooks'));
    await fs.ensureDir(path.join(srcPath, 'features', feature, 'services'));
    await fs.ensureDir(path.join(srcPath, 'features', feature, 'types'));

    // Add barrel export
    const ext = config.language === 'typescript' ? 'ts' : 'js';
    await fs.outputFile(
      path.join(srcPath, 'features', feature, `index.${ext}`),
      `// ${feature} feature exports\n// TODO: Export your components and hooks here\n`
    );
  }

  // Add shared folder
  await fs.ensureDir(path.join(srcPath, 'shared', 'components', 'ui'));
  await fs.ensureDir(path.join(srcPath, 'shared', 'components', 'layout'));
  await fs.ensureDir(path.join(srcPath, 'shared', 'hooks'));
  await fs.ensureDir(path.join(srcPath, 'shared', 'utils'));
  await fs.ensureDir(path.join(srcPath, 'shared', 'types'));
  await fs.ensureDir(path.join(srcPath, 'shared', 'constants'));
}

/**
 * Create component-based folder structure
 */
async function createComponentBasedStructure(srcPath, _config) {
  await fs.ensureDir(path.join(srcPath, 'components', 'ui'));
  await fs.ensureDir(path.join(srcPath, 'components', 'layout'));
  await fs.ensureDir(path.join(srcPath, 'components', 'forms'));
  await fs.ensureDir(path.join(srcPath, 'pages'));
  await fs.ensureDir(path.join(srcPath, 'hooks'));
  await fs.ensureDir(path.join(srcPath, 'services'));
  await fs.ensureDir(path.join(srcPath, 'utils'));
  await fs.ensureDir(path.join(srcPath, 'types'));
  await fs.ensureDir(path.join(srcPath, 'constants'));
}

/**
 * Create atomic design folder structure
 */
async function createAtomicStructure(srcPath, config) {
  await fs.ensureDir(path.join(srcPath, 'components', 'atoms'));
  await fs.ensureDir(path.join(srcPath, 'components', 'molecules'));
  await fs.ensureDir(path.join(srcPath, 'components', 'organisms'));
  await fs.ensureDir(path.join(srcPath, 'components', 'templates'));
  await fs.ensureDir(path.join(srcPath, 'pages'));
  await fs.ensureDir(path.join(srcPath, 'hooks'));
  await fs.ensureDir(path.join(srcPath, 'services'));
  await fs.ensureDir(path.join(srcPath, 'utils'));
  await fs.ensureDir(path.join(srcPath, 'types'));
}

/**
 * Enhance backend project with custom folder structure
 */
async function enhanceBackendStructure(projectPath, config) {
  const { folderStructure = 'mvc' } = config;
  const srcPath = path.join(projectPath, 'src');

  await fs.ensureDir(srcPath);

  switch (folderStructure) {
    case 'mvc':
      await createMVCStructure(srcPath, config);
      break;
    case 'clean-architecture':
      await createCleanArchitectureStructure(srcPath, config);
      break;
    case 'feature-based':
      await createBackendFeatureBasedStructure(srcPath, config);
      break;
    case 'layered':
      await createLayeredStructure(srcPath, config);
      break;
    default:
      await createMVCStructure(srcPath, config);
  }

  console.log(chalk.gray(`  ✓ Added ${folderStructure} folder structure`));
}

/**
 * Create MVC folder structure for backend
 */
async function createMVCStructure(srcPath, config) {
  await fs.ensureDir(path.join(srcPath, 'models'));
  await fs.ensureDir(path.join(srcPath, 'controllers'));
  await fs.ensureDir(path.join(srcPath, 'routes'));
  await fs.ensureDir(path.join(srcPath, 'middlewares'));
  await fs.ensureDir(path.join(srcPath, 'services'));
  await fs.ensureDir(path.join(srcPath, 'utils'));
  await fs.ensureDir(path.join(srcPath, 'config'));
  await fs.ensureDir(path.join(srcPath, 'types'));
}

/**
 * Create clean architecture structure
 */
async function createCleanArchitectureStructure(srcPath, config) {
  await fs.ensureDir(path.join(srcPath, 'domain', 'entities'));
  await fs.ensureDir(path.join(srcPath, 'domain', 'repositories'));
  await fs.ensureDir(path.join(srcPath, 'domain', 'use-cases'));
  await fs.ensureDir(path.join(srcPath, 'application', 'services'));
  await fs.ensureDir(path.join(srcPath, 'infrastructure', 'database'));
  await fs.ensureDir(path.join(srcPath, 'infrastructure', 'repositories'));
  await fs.ensureDir(path.join(srcPath, 'presentation', 'controllers'));
  await fs.ensureDir(path.join(srcPath, 'presentation', 'middlewares'));
  await fs.ensureDir(path.join(srcPath, 'presentation', 'routes'));
}

/**
 * Create feature-based structure for backend
 */
async function createBackendFeatureBasedStructure(srcPath, config) {
  const features = ['auth', 'users', 'posts'];

  for (const feature of features) {
    await fs.ensureDir(path.join(srcPath, 'features', feature, 'controllers'));
    await fs.ensureDir(path.join(srcPath, 'features', feature, 'services'));
    await fs.ensureDir(path.join(srcPath, 'features', feature, 'models'));
    await fs.ensureDir(path.join(srcPath, 'features', feature, 'routes'));
  }

  await fs.ensureDir(path.join(srcPath, 'shared', 'middlewares'));
  await fs.ensureDir(path.join(srcPath, 'shared', 'utils'));
  await fs.ensureDir(path.join(srcPath, 'shared', 'config'));
}

/**
 * Create layered structure
 */
async function createLayeredStructure(srcPath, config) {
  await fs.ensureDir(path.join(srcPath, 'controllers'));
  await fs.ensureDir(path.join(srcPath, 'services'));
  await fs.ensureDir(path.join(srcPath, 'repositories'));
  await fs.ensureDir(path.join(srcPath, 'models'));
  await fs.ensureDir(path.join(srcPath, 'routes'));
  await fs.ensureDir(path.join(srcPath, 'middlewares'));
  await fs.ensureDir(path.join(srcPath, 'utils'));
  await fs.ensureDir(path.join(srcPath, 'config'));
}

/**
 * Enhance library structure
 */
async function enhanceLibraryStructure(projectPath, config) {
  const srcPath = path.join(projectPath, 'src');
  await fs.ensureDir(srcPath);
  await fs.ensureDir(path.join(srcPath, 'core'));
  await fs.ensureDir(path.join(srcPath, 'utils'));
  await fs.ensureDir(path.join(srcPath, 'types'));
  await fs.ensureDir(path.join(projectPath, 'tests'));
  await fs.ensureDir(path.join(projectPath, 'docs'));

  console.log(chalk.gray('  ✓ Added library folder structure'));
}

/**
 * Generate environment files
 */
async function generateEnvFiles(projectPath, config) {
  const envExample = `# Environment Variables
# Copy this file to .env and fill in your values

# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=

# API Keys
API_KEY=
`;

  await fs.outputFile(path.join(projectPath, '.env.example'), envExample);
  console.log(chalk.gray('  ✓ Added .env.example'));
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
async function generateDockerFiles(projectPath, _config) {
  const dockerfile = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`;

  await fs.outputFile(path.join(projectPath, 'Dockerfile'), dockerfile);

  const dockerignore = `node_modules
.git
.env
npm-debug.log
`;

  await fs.outputFile(path.join(projectPath, '.dockerignore'), dockerignore);
}

/**
 * Generate GitHub Actions CI/CD workflow
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration
 * @returns {Promise<void>}
 */
async function generateGitHubActions(projectPath, _config) {
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

  await fs.outputFile(path.join(projectPath, '.github', 'workflows', 'ci.yml'), workflow);
}

/**
 * Generate Husky Git hooks for pre-commit linting
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User's project configuration
 * @returns {Promise<void>}
 */
async function generateHuskyFiles(projectPath, _config) {
  await fs.ensureDir(path.join(projectPath, '.husky'));

  const preCommit = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
`;

  await fs.outputFile(path.join(projectPath, '.husky', 'pre-commit'), preCommit);
}

export { generateTemplate };
