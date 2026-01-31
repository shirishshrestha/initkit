import { spawn } from 'child_process';
import chalk from 'chalk';

/**
 * Execute a CLI command with proper error handling and output streaming
 *
 * This utility function spawns a child process to run external CLI commands
 * (like create-next-app, create-vite, etc.) while maintaining proper error
 * handling and allowing the user to see the output in real-time.
 *
 * @param {string} command - The full command to execute (e.g., "npx create-next-app my-app")
 * @param {Object} [options={}] - Execution options
 * @param {string} [options.cwd=process.cwd()] - Working directory for the command
 * @param {string|Array} [options.stdio='inherit'] - How to handle stdin/stdout/stderr
 * @param {boolean} [options.shell=true] - Whether to run in a shell
 * @param {Object} [options.env] - Environment variables
 *
 * @returns {Promise<void>}
 * @throws {Error} If command execution fails
 *
 * @example
 * // Bootstrap a Next.js project
 * await execCommand('npx create-next-app@latest my-app --typescript', {
 *   cwd: '/path/to/parent/dir'
 * });
 *
 * @example
 * // Install dependencies
 * await execCommand('npm install @reduxjs/toolkit react-redux', {
 *   cwd: '/path/to/project'
 * });
 */
export async function execCommand(command, options = {}) {
  const {
    cwd = process.cwd(),
    stdio = 'inherit',
    shell = true,
    env = { ...process.env, FORCE_COLOR: '1', CI: 'true' },
  } = options;

  return new Promise((resolve, reject) => {
    // Parse command into executable and arguments
    const args = command.split(' ');
    const cmd = args.shift();

    const child = spawn(cmd, args, {
      cwd,
      stdio,
      shell,
      env,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${chalk.red(command)}`));
      }
    });

    child.on('error', (error) => {
      reject(
        new Error(`Failed to execute command: ${chalk.red(error.message)}\nCommand: ${command}`)
      );
    });
  });
}

/**
 * Execute a command and capture its output
 *
 * Unlike execCommand which streams output to the console, this function
 * captures stdout and stderr and returns them as strings. Useful for
 * commands where you need to parse the output.
 *
 * @param {string} command - The command to execute
 * @param {Object} [options={}] - Execution options
 * @param {string} [options.cwd=process.cwd()] - Working directory
 *
 * @returns {Promise<{stdout: string, stderr: string}>}
 * @throws {Error} If command execution fails
 *
 * @example
 * // Get npm version
 * const { stdout } = await execCommandWithOutput('npm --version');
 * console.log('npm version:', stdout.trim());
 */
export async function execCommandWithOutput(command, options = {}) {
  const { cwd = process.cwd() } = options;

  return new Promise((resolve, reject) => {
    const args = command.split(' ');
    const cmd = args.shift();

    let stdout = '';
    let stderr = '';

    const child = spawn(cmd, args, {
      cwd,
      shell: true,
      env: { ...process.env },
    });

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command failed with exit code ${code}\nStderr: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to execute command: ${error.message}`));
    });
  });
}

/**
 * Check if a command exists in the system
 *
 * @param {string} command - The command to check (e.g., 'npm', 'git')
 * @returns {Promise<boolean>}
 *
 * @example
 * if (await commandExists('pnpm')) {
 *   console.log('pnpm is installed');
 * }
 */
export async function commandExists(command) {
  const checkCmd = process.platform === 'win32' ? `where ${command}` : `which ${command}`;

  try {
    await execCommandWithOutput(checkCmd);
    return true;
  } catch {
    return false;
  }
}
