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

    // Step 6: Display summary
    if (verbose) {
      displayProjectSummary(answers, projectPath);
    }

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
 * Display a summary of the created project
 * @param {Object} answers - Project configuration
 * @param {string} projectPath - Path to the project
 */
function displayProjectSummary(answers, projectPath) {
  console.log(chalk.cyan.bold('\nProject Summary:\n'));
  console.log(chalk.white(`  Name: ${answers.projectName}`));
  console.log(chalk.white(`  Type: ${answers.projectType}`));
  console.log(chalk.white(`  Language: ${answers.language || 'JavaScript'}`));
  
  if (answers.frontend) {
    console.log(chalk.white(`  Frontend: ${answers.frontend}`));
  }
  
  if (answers.backend) {
    console.log(chalk.white(`  Backend: ${answers.backend}`));
  }
  
  if (answers.database && answers.database !== 'none') {
    console.log(chalk.white(`  Database: ${answers.database}`));
  }
  
  console.log(chalk.white(`  Package Manager: ${answers.packageManager}`));
  console.log(chalk.white(`  Location: ${projectPath}`));
  
  if (answers.features && answers.features.length > 0) {
    console.log(chalk.white(`  Features: ${answers.features.join(', ')}`));
  }
  
  console.log('');
}

export { createProject };
