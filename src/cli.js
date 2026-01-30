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
  console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════════╗
║                                           ║
║        Welcome to InitKit CLI            ║
║                                           ║
║   Scaffold modern web projects with      ║
║   best practices and lightning speed     ║
║                                           ║
╚═══════════════════════════════════════════╝
  `));
  console.log(chalk.gray(`Version: ${packageJson.version}\n`));
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
          throw new CLIError(
            `Invalid project name: ${projectName}`,
            ERROR_CODES.VALIDATION_ERROR,
            { errors: validation.errors.join(', ') }
          );
        }

        // Check if directory exists
        const dirCheck = checkDirectoryExists(projectName);
        if (dirCheck.exists) {
          throw new CLIError(
            `Directory "${projectName}" already exists`,
            ERROR_CODES.DIRECTORY_EXISTS,
            { path: dirCheck.path }
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

      // Success message
      console.log(chalk.green.bold('\nProject created successfully!\n'));
      displayNextSteps(answers);

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

// Display next steps
function displayNextSteps(answers) {
  const { projectName, packageManager, installDependencies } = answers;
  
  console.log(chalk.cyan.bold('Next steps:\n'));
  console.log(chalk.white(`  ${chalk.cyan('1.')} Navigate to your project:`));
  console.log(chalk.gray(`     cd ${projectName}\n`));
  
  if (!installDependencies) {
    console.log(chalk.white(`  ${chalk.cyan('2.')} Install dependencies:`));
    console.log(chalk.gray(`     ${packageManager} install\n`));
  }
  
  const stepNum = installDependencies ? 2 : 3;
  console.log(chalk.white(`  ${chalk.cyan(`${stepNum}.`)} Start development server:`));
  console.log(chalk.gray(`     ${packageManager} ${packageManager === 'npm' ? 'run ' : ''}dev\n`));
  
  console.log(chalk.green('Happy coding!\n'));
}

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
