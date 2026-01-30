import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { generateTemplate } from '../utils/templateGenerator.js';
import { installDependencies } from '../utils/packageManager.js';
import { initGit } from '../utils/git.js';
import {
  CLIError,
  ERROR_CODES,
  withErrorHandling,
  rollbackProject,
  safeFileOperation,
} from '../utils/errorHandler.js';

/**
 * Create a new project based on user answers
 * @param {Object} answers - User's answers from prompts
 * @param {Object} options - Additional options
 */
async function createProject(answers, options = {}) {
  const { verbose = false, projectPath: customProjectPath } = options;
  const projectPath = customProjectPath || path.join(process.cwd(), answers.projectName);
  let spinner;

  try {
    // Step 1: Check if directory already exists
    if (await fs.pathExists(projectPath)) {
      throw new CLIError(
        `Directory "${answers.projectName}" already exists!`,
        ERROR_CODES.DIRECTORY_EXISTS,
        { path: projectPath }
      );
    }

    // Step 2: Create project directory
    spinner = ora({
      text: 'Creating project structure...',
      color: 'cyan',
    }).start();

    await safeFileOperation(
      () => fs.ensureDir(projectPath),
      'Creating project directory'
    );

    if (verbose) {
      spinner.info(chalk.gray(`Created directory: ${projectPath}`));
      spinner.start('Generating project files...');
    }

    // Step 3: Generate project files from templates
    await withErrorHandling(
      () => generateTemplate(projectPath, answers),
      {
        projectPath,
        rollback: true,
        errorCode: ERROR_CODES.CREATION_FAILED,
        context: { step: 'template generation' },
      }
    );

    spinner.succeed(chalk.green('Project structure created'));

    // Step 4: Initialize Git if requested
    if (answers.useGit) {
      const gitSpinner = ora('Initializing Git repository...').start();
      
      try {
        await initGit(projectPath);
        gitSpinner.succeed(chalk.green('Git repository initialized'));
      } catch (error) {
        gitSpinner.warn(chalk.yellow('Git initialization skipped'));
        
        if (verbose) {
          console.log(chalk.gray(`   Reason: ${error.message}`));
        }
      }
    }

    // Step 5: Install dependencies
    if (answers.installDependencies !== false) {
      try {
        await installDependencies(projectPath, answers.packageManager, {
          verbose,
        });
      } catch (error) {
        // Don't fail the entire process if install fails
        console.log(chalk.yellow('\nDependency installation failed'));
        console.log(chalk.gray('   You can install them manually later\n'));
        
        if (verbose) {
          console.log(chalk.gray(`   Error: ${error.message}`));
        }
      }
    } else {
      console.log(chalk.gray('\n   Skipping dependency installation (--no-install)'));
    }

    // Step 6: Display comprehensive success summary
    displaySuccessSummary(answers, projectPath, verbose);

  } catch (error) {
    // Stop any running spinners
    if (spinner && spinner.isSpinning) {
      spinner.fail(chalk.red('Project creation failed'));
    }

    // If it's already a CLIError, just re-throw it
    if (error instanceof CLIError) {
      throw error;
    }

    // Wrap unexpected errors
    throw new CLIError(
      `Failed to create project: ${error.message}`,
      ERROR_CODES.CREATION_FAILED,
      { originalError: error.name, path: projectPath }
    );
  }
}

/**
 * Display comprehensive success summary after project creation
 * @param {Object} answers - Project configuration
 * @param {string} projectPath - Path to the project
 * @param {boolean} verbose - Show detailed information
 */
function displaySuccessSummary(answers, projectPath, verbose = false) {
  console.log('');
  console.log(chalk.green('╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.green('║') + chalk.green.bold('              ✨ Project Created Successfully! ✨           ') + chalk.green('║'));
  console.log(chalk.green('╚════════════════════════════════════════════════════════════╝'));
  console.log('');

  // Project info section
  console.log(chalk.cyan.bold('  📦 Project Information'));
  console.log(chalk.white(`     ${chalk.gray('Name:')}        ${chalk.bold(answers.projectName)}`));
  console.log(chalk.white(`     ${chalk.gray('Type:')}        ${answers.projectType}`));
  console.log(chalk.white(`     ${chalk.gray('Language:')}    ${answers.language || 'JavaScript'}`));
  
  if (answers.frontend) {
    console.log(chalk.white(`     ${chalk.gray('Frontend:')}    ${answers.frontend}`));
  }
  
  if (answers.backend) {
    console.log(chalk.white(`     ${chalk.gray('Backend:')}     ${answers.backend}`));
  }

  if (answers.fullstackType) {
    console.log(chalk.white(`     ${chalk.gray('Architecture:')} ${answers.fullstackType}`));
  }
  
  if (answers.database && answers.database !== 'none') {
    console.log(chalk.white(`     ${chalk.gray('Database:')}    ${answers.database}`));
  }
  console.log('');

  // Location section
  console.log(chalk.cyan.bold('  📁 Project Location'));
  console.log(chalk.white(`     ${projectPath}`));
  console.log('');

  // Features section
  if (answers.features && answers.features.length > 0) {
    console.log(chalk.cyan.bold('  ⚙️  Configured Features'));
    answers.features.forEach(feature => {
      console.log(chalk.white(`     ${chalk.green('✓')} ${feature}`));
    });
    console.log('');
  }

  // Additional libraries
  if (answers.additionalLibraries && answers.additionalLibraries.length > 0) {
    console.log(chalk.cyan.bold('  📚 Additional Libraries'));
    answers.additionalLibraries.slice(0, 5).forEach(lib => {
      console.log(chalk.white(`     ${chalk.green('✓')} ${lib}`));
    });
    if (answers.additionalLibraries.length > 5) {
      console.log(chalk.gray(`     ... and ${answers.additionalLibraries.length - 5} more`));
    }
    console.log('');
  }

  // Package manager info
  const packagesInstalled = answers.installDependencies !== false;
  if (packagesInstalled) {
    console.log(chalk.cyan.bold('  📦 Dependencies'));
    console.log(chalk.white(`     ${chalk.green('✓')} Installed with ${answers.packageManager}`));
    console.log('');
  }

  // Next steps
  console.log(chalk.cyan.bold('  🚀 Next Steps'));
  console.log('');
  console.log(chalk.white(`     ${chalk.yellow('1.')} Navigate to your project:`));
  console.log(chalk.gray(`        cd ${answers.projectName}`));
  console.log('');
  
  if (!packagesInstalled) {
    console.log(chalk.white(`     ${chalk.yellow('2.')} Install dependencies:`));
    console.log(chalk.gray(`        ${answers.packageManager} install`));
    console.log('');
  }
  
  const stepNum = packagesInstalled ? 2 : 3;
  console.log(chalk.white(`     ${chalk.yellow(stepNum + '.')} Start development server:`));
  console.log(chalk.gray(`        ${answers.packageManager} ${answers.packageManager === 'npm' ? 'run ' : ''}dev`));
  console.log('');
  
  console.log(chalk.white(`     ${chalk.yellow((stepNum + 1) + '.')} Read the README for more info:`));
  console.log(chalk.gray(`        cat README.md`));
  console.log('');

  // Documentation link
  console.log(chalk.cyan.bold('  📚 Documentation'));
  console.log(chalk.white(`     Check out the README.md in your project folder`));
  console.log(chalk.white(`     for setup instructions and best practices.`));
  console.log('');

  // Footer
  console.log(chalk.green('  ─────────────────────────────────────────────────────────────'));
  console.log(chalk.green.bold('           🎉 Happy coding! Your project is ready! 🎉'));
  console.log(chalk.green('  ─────────────────────────────────────────────────────────────'));
  console.log('');
}

export { createProject };
