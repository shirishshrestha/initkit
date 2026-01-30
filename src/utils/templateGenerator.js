import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate project files from templates
 * @param {string} projectPath - Path to the project directory
 * @param {Object} config - User's project configuration
 */
async function generateTemplate(projectPath, config) {
  const templatesDir = path.join(__dirname, '../../templates');

  // Copy base template
  await copyBaseTemplate(projectPath, config);

  // Generate package.json
  await generatePackageJson(projectPath, config);

  // Generate README
  await generateReadme(projectPath, config);

  // Generate project-specific files
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

  // Add additional features
  if (config.features) {
    await addFeatures(projectPath, config);
  }
}

async function copyBaseTemplate(projectPath, config) {
  // Create basic directory structure
  await fs.ensureDir(path.join(projectPath, 'src'));

  if (config.projectType === 'fullstack') {
    await fs.ensureDir(path.join(projectPath, 'client'));
    await fs.ensureDir(path.join(projectPath, 'server'));
  }
}

async function generatePackageJson(projectPath, config) {
  const packageJson = {
    name: config.projectName,
    version: '1.0.0',
    description: `A ${config.projectType} project`,
    main: config.projectType === 'library' ? 'dist/index.js' : 'src/index.js',
    scripts: generateScripts(config),
    keywords: [],
    author: '',
    license: 'MIT',
    dependencies: {},
    devDependencies: {},
  };

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
}

async function generateReadme(projectPath, config) {
  const readme = `# ${config.projectName}

${config.projectType.charAt(0).toUpperCase() + config.projectType.slice(1)} project created with InitKit

## Getting Started

\`\`\`bash
${config.packageManager} install
${config.packageManager} ${config.packageManager === 'npm' ? 'run ' : ''}dev
\`\`\`

## Project Structure

TODO: Add project structure

## Available Scripts

TODO: Add available scripts

## License

MIT
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

async function generateFrontendFiles(projectPath, config) {
  // Create frontend-specific files based on chosen framework
  const srcPath = path.join(projectPath, 'src');

  // Create a basic index file
  const indexContent = config.useTypescript
    ? `import './styles/main.css';\n\nconsole.log('Hello from ${config.frontend}!');\n`
    : `import './styles/main.css';\n\nconsole.log('Hello from ${config.frontend}!');\n`;

  const ext = config.useTypescript ? 'ts' : 'js';
  await fs.writeFile(path.join(srcPath, `index.${ext}`), indexContent);

  // Create styles directory
  await fs.ensureDir(path.join(srcPath, 'styles'));
  await fs.writeFile(path.join(srcPath, 'styles', 'main.css'), '/* Add your styles here */\n');
}

async function generateBackendFiles(projectPath, config) {
  // Create backend-specific files based on chosen framework
  const srcPath = path.join(projectPath, 'src');

  const ext = config.useTypescript ? 'ts' : 'js';
  const serverContent = `// ${config.backend} server\n\nconst PORT = process.env.PORT || 3000;\n\nconsole.log(\`Server starting on port \${PORT}\`);\n`;

  await fs.writeFile(path.join(srcPath, `server.${ext}`), serverContent);
}

async function generateFullStackFiles(projectPath, config) {
  // Generate both frontend and backend
  await generateFrontendFiles(path.join(projectPath, 'client'), {
    ...config,
    projectType: 'frontend',
  });

  await generateBackendFiles(path.join(projectPath, 'server'), {
    ...config,
    projectType: 'backend',
  });
}

async function generateLibraryFiles(projectPath, config) {
  const srcPath = path.join(projectPath, 'src');
  const ext = config.useTypescript ? 'ts' : 'js';

  const indexContent = `/**
 * Main entry point for ${config.projectName}
 */

export function hello() {
  return 'Hello from ${config.projectName}!';
}
`;

  await fs.writeFile(path.join(srcPath, `index.${ext}`), indexContent);
}

async function addFeatures(projectPath, config) {
  const features = config.features || [];

  // Add ESLint
  if (features.includes('eslint')) {
    await fs.writeJSON(
      path.join(projectPath, '.eslintrc.json'),
      {
        extends: ['eslint:recommended'],
        env: {
          node: true,
          es2021: true,
        },
      },
      { spaces: 2 }
    );
  }

  // Add Prettier
  if (features.includes('prettier')) {
    await fs.writeJSON(
      path.join(projectPath, '.prettierrc'),
      {
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
      },
      { spaces: 2 }
    );
  }

  // Add .env file
  if (features.includes('dotenv')) {
    await fs.writeFile(
      path.join(projectPath, '.env.example'),
      '# Environment variables\nNODE_ENV=development\n'
    );
  }
}

function generateScripts(config) {
  const scripts = {
    dev: 'node src/index.js',
    start: 'node src/index.js',
  };

  if (config.features?.includes('jest')) {
    scripts.test = 'jest';
  }

  if (config.features?.includes('eslint')) {
    scripts.lint = 'eslint src/**/*.js';
  }

  return scripts;
}

export { generateTemplate };
