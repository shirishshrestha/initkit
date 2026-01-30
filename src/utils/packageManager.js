import { exec } from 'child_process';
import { promisify } from 'util';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Install dependencies using the specified package manager
 * @param {string} projectPath - Path to the project
 * @param {string} packageManager - npm, yarn, or pnpm
 * @param {Object} options - Installation options
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
 * @param {string} packageManager - npm, yarn, or pnpm
 * @returns {string} The install command
 */
function getInstallCommand(packageManager) {
  const commands = {
    npm: 'npm install',
    yarn: 'yarn',
    pnpm: 'pnpm install',
  };

  return commands[packageManager] || commands.npm;
}

export { installDependencies, getInstallCommand };
