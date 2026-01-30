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
  .version(packageJson.version, '-v, --version', 'Output the current version');

// Main create command
program
  .command('create [project-name]', { isDefault: true })
  .description('Create a new project')
  .option('-t, --template <template>', 'Specify template (react, vue, express, etc.)')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--ts, --typescript', 'Use TypeScript (default: true)')
  .option('--js, --javascript', 'Use JavaScript instead of TypeScript')
  .option('--no-git', 'Skip Git initialization')
  .option('--no-install', 'Skip dependency installation')
  .option('-p, --package-manager <manager>', 'Package manager to use (npm, yarn, pnpm)', 'npm')
  .option('--verbose', 'Show detailed output')
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
  .description('Display information about InitKit CLI')
  .action(() => {
    console.log(chalk.cyan.bold('\nInitKit CLI Information\n'));
    console.log(chalk.white(`Version: ${packageJson.version}`));
    console.log(chalk.white(`Description: ${packageJson.description}`));
    console.log(chalk.white(`Author: ${packageJson.author}`));
    console.log(chalk.white(`License: ${packageJson.license}`));
    console.log(chalk.white(`Repository: ${packageJson.repository?.url || 'N/A'}`));
    console.log('\n');
  });

// List command - show available templates
program
  .command('list')
  .description('List available project templates and frameworks')
  .action(() => {
    console.log(chalk.cyan.bold('\nAvailable Templates\n'));
    
    console.log(chalk.yellow('Frontend Frameworks:'));
    console.log('  • React');
    console.log('  • Vue.js');
    console.log('  • Angular');
    console.log('  • Svelte');
    console.log('  • Next.js');
    console.log('  • Nuxt.js');
    
    console.log(chalk.yellow('\nBackend Frameworks:'));
    console.log('  • Express.js');
    console.log('  • Fastify');
    console.log('  • Koa');
    console.log('  • NestJS');
    console.log('  • Hapi');
    
    console.log(chalk.yellow('\nDatabases:'));
    console.log('  • PostgreSQL');
    console.log('  • MySQL');
    console.log('  • MongoDB');
    console.log('  • SQLite');
    
    console.log('\n');
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
