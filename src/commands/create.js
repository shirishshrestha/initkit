import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { generateTemplate } from '../utils/templateGenerator.js';
import { initGit } from '../utils/git.js';
import { bootstrapWithOfficialCLI } from '../utils/frameworkBootstrap.js';
import { installAddons, hasAddons } from '../utils/addonInstaller.js';
import {
  CLIError,
  ERROR_CODES,
  withErrorHandling,
  rollbackProject,
} from '../utils/errorHandler.js';

/**
 * Create a new project based on user configuration
 *
 * This is the main orchestration function that:
 * 1. Creates the project directory
 * 2. Generates template files
 * 3. Installs dependencies
 * 4. Initializes Git repository
 * 5. Handles errors with automatic rollback
 *
 * @param {Object} answers - User's configuration from interactive prompts
 * @param {string} answers.projectName - Name of the project (used for directory)
 * @param {string} answers.projectType - Type of project ('frontend'|'backend'|'library')
 * @param {string} [answers.frontend] - Frontend framework choice
 * @param {string} [answers.backend] - Backend framework choice
 * @param {string} answers.language - Programming language ('typescript'|'javascript')
 * @param {string} answers.packageManager - Package manager ('npm'|'yarn'|'pnpm')
 * @param {boolean} [answers.gitInit] - Whether to initialize Git repository
 *
 * @param {Object} [options={}] - Additional command-line options
 * @param {boolean} [options.verbose=false] - Show detailed output during creation
 * @param {string} [options.projectPath] - Custom path for project (overrides answers.projectName)
 *
 * @returns {Promise<void>}
 * @throws {CLIError} If project creation fails at any step (automatic rollback triggered)
 *
 * @example
 * // Basic usage
 * await createProject({
 *   projectName: 'my-app',
 *   projectType: 'frontend',
 *   frontend: 'react',
 *   language: 'typescript',
 *   packageManager: 'npm',
 *   gitInit: true
 * });
 *
 * @example
 * // With verbose output
 * await createProject(answers, { verbose: true });
 */
async function createProject(answers, options = {}) {
  const { verbose = false, projectPath: customProjectPath } = options;
  const projectPath = customProjectPath || path.join(process.cwd(), answers.projectName);
  let spinner = ora();

  try {
    // ============================================
    // STEP 1: Bootstrap with Official Framework CLI
    // ============================================
    spinner = ora({
      text: 'Bootstrapping project with official CLI...',
      color: 'cyan',
    }).start();

    // Check if directory already exists
    if (await fs.pathExists(projectPath)) {
      throw new CLIError(
        `Directory "${answers.projectName}" already exists!`,
        ERROR_CODES.DIRECTORY_EXISTS,
        { path: projectPath }
      );
    }

    await withErrorHandling(() => bootstrapWithOfficialCLI(projectPath, answers), {
      projectPath,
      rollback: true,
      errorCode: ERROR_CODES.CREATION_FAILED,
      context: { step: 'CLI bootstrapping' },
    });

    spinner.succeed(chalk.green('✓ Base project created'));

    // ============================================
    // STEP 2: Install Add-ons with Official CLIs/Commands
    // ============================================
    if (hasAddons(answers)) {
      spinner = ora({
        text: 'Installing selected libraries and add-ons...',
        color: 'cyan',
      }).start();

      await withErrorHandling(() => installAddons(projectPath, answers), {
        projectPath,
        rollback: true,
        errorCode: ERROR_CODES.CREATION_FAILED,
        context: { step: 'add-on installation' },
      });

      spinner.succeed(chalk.green('✓ Add-ons installed'));
    }

    // ============================================
    // STEP 3: Enhance with Custom Folder Structure
    // ============================================
    spinner = ora({
      text: 'Creating custom folder structure...',
      color: 'cyan',
    }).start();

    await withErrorHandling(() => generateTemplate(projectPath, answers), {
      projectPath,
      rollback: true,
      errorCode: ERROR_CODES.CREATION_FAILED,
      context: { step: 'folder structure enhancement' },
    });

    spinner.succeed(chalk.green('✓ Folder structure configured'));

    // ============================================
    // STEP 4: Install Dependencies
    // ============================================
    spinner = ora({
      text: `Installing dependencies with ${answers.packageManager}...`,
      color: 'cyan',
    }).start();

    try {
      const installCmd = getInstallCommand(answers.packageManager);
      const { execCommand } = await import('../utils/cliRunner.js');
      await execCommand(installCmd, { cwd: projectPath });
      spinner.succeed(chalk.green('✓ Dependencies installed'));
    } catch (error) {
      spinner.warn(chalk.yellow('⚠ Dependency installation had issues'));
      console.log(chalk.gray(`   You can run '${answers.packageManager} install' manually\\n`));
    }

    // ============================================
    // STEP 5: Initialize Git Repository
    // ============================================
    if (answers.useGit) {
      spinner = ora({
        text: 'Initializing Git repository...',
        color: 'cyan',
      }).start();

      try {
        await initGit(projectPath);
        spinner.succeed(chalk.green('✓ Git initialized'));
      } catch (error) {
        spinner.warn(chalk.yellow('⚠ Git initialization skipped'));

        if (verbose) {
          console.log(chalk.gray(`   Reason: ${error.message}`));
        }
      }
    }

    // ============================================
    // SUCCESS!
    // ============================================
    console.log('\n');
    displaySuccessMessage(answers, projectPath);
  } catch (error) {
    // Stop any running spinners
    if (spinner && spinner.isSpinning) {
      spinner.fail(chalk.red('✗ Project creation failed'));
    }

    console.log(chalk.red('\n✗ Error: ' + error.message));

    // Rollback project directory
    await rollbackProject(projectPath);

    // If it's already a CLIError, just re-throw it
    if (error instanceof CLIError) {
      throw error;
    }

    // Wrap unexpected errors
    throw new CLIError(`Failed to create project: ${error.message}`, ERROR_CODES.CREATION_FAILED, {
      originalError: error.name,
      path: projectPath,
    });
  }
}

/**
 * Display success message after project creation
 * @param {Object} answers - Project configuration
 * @param {string} projectPath - Path to the project
 */
function displaySuccessMessage(answers, projectPath) {
  const projectName = path.basename(projectPath);

  console.log(chalk.green.bold('🎉 Project created successfully!\n'));
  console.log(chalk.cyan('Next steps:'));
  console.log(chalk.white(`  cd ${projectName}`));
  console.log(chalk.white(`  ${answers.packageManager} run dev\n`));

  // Show installed add-ons
  if (hasAddons(answers)) {
    console.log(chalk.cyan('Installed add-ons:'));
    if (answers.stateManagement && answers.stateManagement !== 'none') {
      console.log(chalk.white(`  ✓ State management: ${answers.stateManagement}`));
    }
    if (answers.uiLibrary && answers.uiLibrary !== 'none') {
      console.log(chalk.white(`  ✓ UI library: ${answers.uiLibrary}`));
    }
    if (answers.orm && answers.orm !== 'none') {
      console.log(chalk.white(`  ✓ ORM: ${answers.orm}`));
    }
    if (answers.authentication && answers.authentication !== 'none') {
      console.log(chalk.white(`  ✓ Authentication: ${answers.authentication}`));
    }
    if (answers.testing && answers.testing.length > 0) {
      console.log(chalk.white(`  ✓ Testing: ${answers.testing.join(', ')}`));
    }
    console.log();
  }

  console.log(chalk.gray('Happy coding! 🚀\n'));
}

/** * Get install command for package manager
 */
function getInstallCommand(packageManager) {
  const commands = {
    npm: 'npm install',
    yarn: 'yarn install',
    pnpm: 'pnpm install',
    bun: 'bun install',
  };
  return commands[packageManager] || 'npm install';
}

export { createProject };
