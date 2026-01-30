import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createProject } from './commands/create.js';
import { getQuestions } from './prompts/questions.js';
import { createRequire } from 'module';
import {
  displayError,
  CLIError,
  ERROR_CODES,
  setupGracefulShutdown,
} from './utils/errorHandler.js';
import { validateProjectName, checkDirectoryExists } from './utils/validation.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

// Display banner
function displayBanner() {
  console.log('');
  console.log(chalk.cyan('╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║') + chalk.cyan.bold('                                                            ') + chalk.cyan('║'));
  console.log(chalk.cyan('║') + chalk.cyan.bold('              🚀 Welcome to InitKit CLI! 🚀               ') + chalk.cyan('║'));
  console.log(chalk.cyan('║') + chalk.cyan.bold('                                                            ') + chalk.cyan('║'));
  console.log(chalk.cyan('║') + chalk.white('       Scaffold modern web projects with best               ') + chalk.cyan('║'));
  console.log(chalk.cyan('║') + chalk.white('       practices and lightning-fast speed ⚡                ') + chalk.cyan('║'));
  console.log(chalk.cyan('║') + chalk.cyan.bold('                                                            ') + chalk.cyan('║'));
  console.log(chalk.cyan('╚════════════════════════════════════════════════════════════╝'));
  console.log('');
  console.log(chalk.gray(`         Version ${packageJson.version} | Made with ❤️  by developers\n`));
}

// Set up the CLI program
program
  .name('initkit')
  .description(packageJson.description)
  .usage('[command] [options]')
  .version(packageJson.version, '-v, --version', 'Output the current version')
  .addHelpText('after', `
Examples:
  $ initkit                          # Interactive mode with step-by-step prompts
  $ initkit my-app                   # Create project with interactive prompts
  $ initkit my-app --yes             # Use defaults, skip all prompts
  $ initkit my-app --ts --no-git     # TypeScript without Git initialization

Documentation:
  Quick Start:  https://github.com/shirishshrestha/initkit/blob/main/docs/QUICK_START.md
  User Guide:   https://github.com/shirishshrestha/initkit/blob/main/docs/user-guide.md
  GitHub:       https://github.com/shirishshrestha/initkit

Need help? Report issues at: https://github.com/shirishshrestha/initkit/issues
  `);

// Main create command
program
  .command('create [project-name]', { isDefault: true })
  .description('Create a new project with interactive prompts')
  .option('-t, --template <template>', 'Specify template (react, vue, express, etc.)')
  .option('-y, --yes', 'Skip prompts and use sensible defaults')
  .option('--ts, --typescript', 'Use TypeScript (recommended)')
  .option('--js, --javascript', 'Use JavaScript instead of TypeScript')
  .option('--no-git', 'Skip Git repository initialization')
  .option('--no-install', 'Skip automatic dependency installation')
  .option('-p, --package-manager <manager>', 'Package manager (npm, yarn, pnpm)', 'npm')
  .option('--verbose', 'Show detailed output and logs')
  .addHelpText('after', `
Examples:
  $ initkit create my-react-app
  $ initkit create api-server --template express --typescript
  $ initkit create quick-app --yes --package-manager yarn
  
The create command guides you through an interactive setup with 13 questions:
  1. Project name validation
  2. Project type selection (Frontend/Backend/Full Stack/Library)
  3. Framework selection (React, Vue, Express, etc.)
  4. Language preference (TypeScript/JavaScript)
  5. Folder structure (Feature-based, Type-based, etc.)
  6. Styling solution (Tailwind, CSS Modules, etc.)
  7. Additional tools (Docker, CI/CD, Testing)
  8. Package manager choice
  9. Git initialization
  `)
  .action(async (projectName, options) => {
    try {
      displayBanner();

      let answers;
      let projectPath;

      // Validate project name if provided
      if (projectName) {
        const validation = validateProjectName(projectName);
        if (!validation.valid) {
          const suggestion = require('../utils/validation.js').suggestProjectName(projectName);
          throw new CLIError(
            `"${projectName}" is not a valid project name`,
            ERROR_CODES.VALIDATION_ERROR,
            { suggestion: suggestion, issue: validation.errors[0] }
          );
        }

        // Check if directory exists
        const dirCheck = checkDirectoryExists(projectName);
        if (dirCheck.exists) {
          throw new CLIError(
            `A folder named "${projectName}" already exists here`,
            ERROR_CODES.DIRECTORY_EXISTS,
            { path: dirCheck.path, projectName }
          );
        }

        projectPath = dirCheck.path;
      }

      if (options.yes) {
        // Use default configuration
        answers = {
          projectName: projectName || 'my-project',
          projectType: 'fullstack',
          frontend: 'react',
          backend: 'express',
          language: options.javascript ? 'javascript' : 'typescript',
          folderStructure: 'feature-based',
          typescriptStrict: 'strict',
          useGit: options.git !== false,
          installDependencies: options.install !== false,
          packageManager: options.packageManager || 'npm',
          features: ['eslint', 'prettier', 'dotenv'],
          additionalLibraries: [],
        };
      } else {
        // Interactive prompts
        console.log(chalk.cyan('Let\'s set up your project!\n'));
        const questions = getQuestions(projectName);
        answers = await inquirer.prompt(questions);
        
        // Set additional options from CLI flags
        if (options.javascript) {
          answers.language = 'javascript';
        }
        answers.useGit = options.git !== false;
        answers.installDependencies = options.install !== false;
        answers.packageManager = options.packageManager || answers.packageManager;
      }

      // Derive projectPath if not set
      if (!projectPath) {
        projectPath = checkDirectoryExists(answers.projectName).path;
      }

      // Setup graceful shutdown handler
      setupGracefulShutdown(projectPath);

      // Create the project
      console.log(chalk.cyan('\nCreating your project...\n'));
      await createProject(answers, {
        verbose: options.verbose,
        projectPath,
      });

      // Success message is now part of the comprehensive summary in create.js

    } catch (error) {
      displayError(error, { projectName });
      process.exit(1);
    }
  });

// Info command
program
  .command('info')
  .description('Display detailed information about InitKit CLI')
  .action(() => {
    console.log(chalk.cyan.bold('\n╔════════════════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('║          InitKit CLI Information              ║'));
    console.log(chalk.cyan.bold('╚════════════════════════════════════════════════╝\n'));
    
    console.log(chalk.white.bold('Version:     ') + chalk.green(packageJson.version));
    console.log(chalk.white.bold('Description: ') + chalk.gray(packageJson.description));
    console.log(chalk.white.bold('Author:      ') + chalk.gray(packageJson.author));
    console.log(chalk.white.bold('License:     ') + chalk.gray(packageJson.license));
    console.log(chalk.white.bold('Repository:  ') + chalk.blue(packageJson.repository?.url || 'N/A'));
    
    console.log(chalk.yellow.bold('\nSupported Frameworks:'));
    console.log(chalk.gray('  Frontend: ') + 'React, Vue, Next.js, Angular, Svelte, Nuxt');
    console.log(chalk.gray('  Backend:  ') + 'Express, NestJS, Fastify, Koa, Hapi');
    console.log(chalk.gray('  Database: ') + 'PostgreSQL, MongoDB, MySQL, SQLite');
    
    console.log(chalk.yellow.bold('\nFeatures:'));
    console.log(chalk.gray('  ✓ Interactive project scaffolding'));
    console.log(chalk.gray('  ✓ TypeScript & JavaScript support'));
    console.log(chalk.gray('  ✓ Full-stack monorepo with Turborepo'));
    console.log(chalk.gray('  ✓ Docker & Docker Compose'));
    console.log(chalk.gray('  ✓ CI/CD with GitHub Actions'));
    console.log(chalk.gray('  ✓ ESLint, Prettier, Husky'));
    console.log(chalk.gray('  ✓ Automatic rollback on errors'));
    
    console.log(chalk.cyan('\n💡 Get started: ') + chalk.white('initkit --help\n'));
  });

// List command - show available templates
program
  .command('list')
  .description('List all available project templates, frameworks, and tools')
  .action(() => {
    console.log(chalk.cyan.bold('\n╔════════════════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('║        Available Templates & Tools            ║'));
    console.log(chalk.cyan.bold('╚════════════════════════════════════════════════╝\n'));
    
    console.log(chalk.yellow.bold('🎨 Frontend Frameworks:'));
    console.log(chalk.gray('  • React          ') + chalk.dim('- Popular library for building UIs'));
    console.log(chalk.gray('  • Vue.js         ') + chalk.dim('- Progressive JavaScript framework'));
    console.log(chalk.gray('  • Next.js        ') + chalk.dim('- React framework with SSR & SSG'));
    console.log(chalk.gray('  • Angular        ') + chalk.dim('- Platform for building applications'));
    console.log(chalk.gray('  • Svelte         ') + chalk.dim('- Compile-time framework'));
    console.log(chalk.gray('  • Nuxt.js        ') + chalk.dim('- Vue.js framework with SSR'));
    
    console.log(chalk.yellow.bold('\n⚙️  Backend Frameworks:'));
    console.log(chalk.gray('  • Express.js     ') + chalk.dim('- Fast, minimalist web framework'));
    console.log(chalk.gray('  • NestJS         ') + chalk.dim('- Progressive Node.js framework'));
    console.log(chalk.gray('  • Fastify        ') + chalk.dim('- Fast and low overhead'));
    console.log(chalk.gray('  • Koa            ') + chalk.dim('- Next generation web framework'));
    console.log(chalk.gray('  • Hapi           ') + chalk.dim('- Rich framework for building applications'));
    
    console.log(chalk.yellow.bold('\n💾 Databases:'));
    console.log(chalk.gray('  • PostgreSQL     ') + chalk.dim('- Advanced relational database'));
    console.log(chalk.gray('  • MongoDB        ') + chalk.dim('- NoSQL document database'));
    console.log(chalk.gray('  • MySQL          ') + chalk.dim('- Popular relational database'));
    console.log(chalk.gray('  • SQLite         ') + chalk.dim('- Lightweight embedded database'));
    
    console.log(chalk.yellow.bold('\n🎨 Styling Solutions:'));
    console.log(chalk.gray('  • Tailwind CSS   ') + chalk.dim('- Utility-first CSS framework'));
    console.log(chalk.gray('  • CSS Modules    ') + chalk.dim('- Locally scoped CSS'));
    console.log(chalk.gray('  • Styled Comp.   ') + chalk.dim('- CSS-in-JS solution'));
    console.log(chalk.gray('  • Sass/SCSS      ') + chalk.dim('- CSS preprocessor'));
    console.log(chalk.gray('  • Emotion        ') + chalk.dim('- Performant CSS-in-JS'));
    
    console.log(chalk.yellow.bold('\n🛠️  Development Tools:'));
    console.log(chalk.gray('  • Docker         ') + chalk.dim('- Containerization'));
    console.log(chalk.gray('  • GitHub Actions ') + chalk.dim('- CI/CD automation'));
    console.log(chalk.gray('  • ESLint         ') + chalk.dim('- Code linting'));
    console.log(chalk.gray('  • Prettier       ') + chalk.dim('- Code formatting'));
    console.log(chalk.gray('  • Jest/Vitest    ') + chalk.dim('- Testing frameworks'));
    console.log(chalk.gray('  • Turborepo      ') + chalk.dim('- Monorepo build system'));
    
    console.log(chalk.cyan('\n💡 Create a project: ') + chalk.white('initkit [project-name]\n'));
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red('\nInvalid command: %s'), program.args.join(' '));
  console.log(chalk.yellow('See --help for a list of available commands.\n'));
  process.exit(1);
});

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  displayBanner();
  program.outputHelp();
}

// Parse command-line arguments
program.parse();
