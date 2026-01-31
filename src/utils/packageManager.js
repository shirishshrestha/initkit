import { exec } from 'child_process';
import { promisify } from 'util';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Install project dependencies using the specified package manager
 *
 * Executes the package manager's install command in the project directory.
 * Shows a spinner during installation and provides helpful error messages
 * with manual installation instructions if the operation fails.
 *
 * @param {string} projectPath - Absolute path to the project directory
 * @param {string} [packageManager='npm'] - Package manager to use ('npm'|'yarn'|'pnpm'|'bun')
 * @param {Object} [options={}] - Installation options
 * @param {boolean} [options.verbose=false] - Show detailed command output
 *
 * @returns {Promise<void>}
 * @throws {Error} If dependency installation fails
 *
 * @example
 * // Basic usage with npm
 * await installDependencies('/path/to/project');
 *
 * @example
 * // With specific package manager and verbose output
 * await installDependencies('/path/to/project', 'yarn', { verbose: true });
 */
async function installDependencies(projectPath, packageManager = 'npm', options = {}) {
  const { verbose = false } = options;
  const spinner = ora(`Installing dependencies with ${packageManager}...`).start();

  try {
    const installCommand = getInstallCommand(packageManager);

    if (verbose) {
      spinner.info(chalk.gray(`Running: ${installCommand}`));
      spinner.start('Installing...');
    }

    await execAsync(installCommand, {
      cwd: projectPath,
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });

    spinner.succeed(chalk.green('Dependencies installed successfully'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to install dependencies'));
    console.log(chalk.yellow('\nYou can install them manually by running:'));
    console.log(chalk.cyan(`  cd ${path.basename(projectPath)}`));
    console.log(chalk.cyan(`  ${packageManager} install\n`));

    if (verbose) {
      console.log(chalk.gray(`Error details: ${error.message}`));
    }

    throw error;
  }
}

/**
 * Get the install command for the specified package manager
 *
 * Returns the correct install command syntax for different package managers.
 * Defaults to 'npm install' if an unknown package manager is specified.
 *
 * @param {string} packageManager - Package manager name ('npm'|'yarn'|'pnpm'|'bun')
 * @returns {string} The complete install command to execute
 *
 * @example
 * getInstallCommand('npm');    // Returns: 'npm install'
 * getInstallCommand('yarn');   // Returns: 'yarn install'
 * getInstallCommand('pnpm');   // Returns: 'pnpm install'
 * getInstallCommand('unknown'); // Returns: 'npm install' (fallback)
 */
function getInstallCommand(packageManager) {
  const commands = {
    npm: 'npm install',
    yarn: 'yarn install',
    pnpm: 'pnpm install',
    bun: 'bun install',
  };

  return commands[packageManager] || commands.npm;
}

export { installDependencies, getInstallCommand };
