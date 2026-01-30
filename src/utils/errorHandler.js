import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';


/**
 * Custom error class for CLI operations
 */
export class CLIError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'CLIError';
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error codes for different types of failures
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DIRECTORY_EXISTS: 'DIRECTORY_EXISTS',
  CREATION_FAILED: 'CREATION_FAILED',
  INSTALL_FAILED: 'INSTALL_FAILED',
  GIT_INIT_FAILED: 'GIT_INIT_FAILED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * Format and display error messages with helpful context
 * @param {Error} error - The error object
 * @param {Object} context - Additional context about the error
 */
export function displayError(error, context = {}) {
  console.log('\n');
  console.log(chalk.red('╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.red('║') + chalk.red.bold('                    ❌ Error                             ') + chalk.red('║'));
  console.log(chalk.red('╚════════════════════════════════════════════════════════════╝'));
  console.log('');
  
  if (error instanceof CLIError) {
    console.error(chalk.red.bold('  ' + error.message));
    
    // Display error code
    if (error.code) {
      console.error(chalk.gray(`\n  Error code: ${error.code}`));
    }

    // Display additional details
    if (Object.keys(error.details).length > 0) {
      console.log(chalk.yellow('\n  📋 Details:'));
      Object.entries(error.details).forEach(([key, value]) => {
        console.log(chalk.yellow(`     • ${key}: ${value}`));
      });
    }

    // Display helpful suggestions based on error type
    console.log('');
    displayErrorSuggestions(error.code, context);
  } else {
    console.error(chalk.red.bold('  Unexpected error: ') + chalk.red(error.message));
    
    if (process.env.DEBUG) {
      console.error(chalk.gray('\n  Stack trace:'));
      console.error(chalk.gray(error.stack));
    }
  }

  console.log('\n');
}

/**
 * Display helpful suggestions based on error type
 * @param {string} errorCode - The error code
 * @param {Object} context - Additional context
 */
function displayErrorSuggestions(errorCode, context) {
  const suggestions = {
    [ERROR_CODES.VALIDATION_ERROR]: [
      '💡 Tip: Project names should be lowercase with hyphens (e.g., my-awesome-app)',
      '💡 Valid characters: letters, numbers, hyphens (-) and underscores (_)',
      '💡 Spaces are not allowed - use hyphens instead!',
    ],
    [ERROR_CODES.DIRECTORY_EXISTS]: [
      `🤔 Oops! That folder already exists here.`,
      `💡 Try a different name, or remove the existing one first`,
      `   Command: rm -rf ${context.projectName || 'project-name'}`,
    ],
    [ERROR_CODES.CREATION_FAILED]: [
      '😕 Hmm, couldn\'t create the project folder.',
      '💡 Check if you have permission to write here',
      '💡 Make sure you have enough disk space',
      '💡 Try running in a different directory',
    ],
    [ERROR_CODES.INSTALL_FAILED]: [
      '📦 Package installation hit a snag!',
      '💡 Check your internet connection and try again',
      '💡 You can install packages later with: npm install',
      '💡 Or use --no-install flag to skip installation',
    ],
    [ERROR_CODES.GIT_INIT_FAILED]: [
      '🔧 Git initialization failed.',
      '💡 Make sure Git is installed: git --version',
      '💡 Or skip Git setup with: --no-git flag',
    ],
    [ERROR_CODES.PERMISSION_DENIED]: [
      'You may need elevated permissions to write to this directory',
      'Try running in a different directory where you have write access',
    ],
  };

  const errorSuggestions = suggestions[errorCode];
  if (errorSuggestions && errorSuggestions.length > 0) {
    console.log(chalk.cyan('\n   Suggestions:'));
    errorSuggestions.forEach((suggestion) => {
      console.log(chalk.cyan(`   • ${suggestion}`));
    });
  }
}

/**
 * Rollback project creation on failure
 * @param {string} projectPath - Path to the project directory
 * @param {Object} options - Rollback options
 */
export async function rollbackProject(projectPath, options = {}) {
  const { verbose = false } = options;
  
  if (!projectPath || !fs.existsSync(projectPath)) {
    return;
  }

  const spinner = ora({
    text: 'Cleaning up...',
    color: 'yellow',
  }).start();

  try {
    // Remove the project directory
    await fs.remove(projectPath);
    
    spinner.succeed(chalk.yellow('Cleaned up incomplete project'));
    
    if (verbose) {
      console.log(chalk.gray(`   Removed: ${projectPath}`));
    }
  } catch (error) {
    spinner.fail(chalk.red('Failed to clean up'));
    
    if (verbose) {
      console.error(chalk.gray(`   Error: ${error.message}`));
      console.log(chalk.yellow(`\n   Please manually remove: ${projectPath}`));
    }
  }
}

/**
 * Wrap an async operation with error handling and rollback
 * @param {Function} operation - The async operation to execute
 * @param {Object} options - Options for error handling
 * @returns {Promise<any>}
 */
export async function withErrorHandling(operation, options = {}) {
  const {
    projectPath = null,
    rollback = true,
    errorCode = ERROR_CODES.UNKNOWN_ERROR,
    context = {},
  } = options;

  try {
    return await operation();
  } catch (error) {
    // Perform rollback if requested
    if (rollback && projectPath) {
      await rollbackProject(projectPath, { verbose: true });
    }

    // Throw a CLI error with proper formatting
    if (error instanceof CLIError) {
      throw error;
    }

    throw new CLIError(
      error.message || 'An unexpected error occurred',
      errorCode,
      { originalError: error.name, ...context }
    );
  }
}

/**
 * Handle process termination signals gracefully
 * @param {string} projectPath - Path to clean up on termination
 */
export function setupGracefulShutdown(projectPath) {
  const cleanup = async (signal) => {
    console.log(chalk.yellow(`\n\nReceived ${signal}. Cleaning up...`));
    
    if (projectPath && fs.existsSync(projectPath)) {
      await rollbackProject(projectPath, { verbose: false });
    }
    
    process.exit(0);
  };

  // Handle SIGINT (Ctrl+C)
  process.on('SIGINT', () => cleanup('SIGINT'));
  
  // Handle SIGTERM
  process.on('SIGTERM', () => cleanup('SIGTERM'));
}

/**
 * Validate and handle errors for a specific operation
 * @param {Function} validator - Validation function that returns { valid, errors }
 * @param {string} errorMessage - Custom error message
 */
export function handleValidationError(validator, errorMessage) {
  const result = validator();
  
  if (!result.valid) {
    const errorDetails = {};
    Object.entries(result.errors).forEach(([key, errors]) => {
      errorDetails[key] = errors.join(', ');
    });

    throw new CLIError(
      errorMessage,
      ERROR_CODES.VALIDATION_ERROR,
      errorDetails
    );
  }
}

/**
 * Create a safe wrapper for file operations
 * @param {Function} operation - File operation to wrap
 * @param {string} operationName - Name of the operation for error messages
 */
export async function safeFileOperation(operation, operationName = 'File operation') {
  try {
    return await operation();
  } catch (error) {
    if (error.code === 'EACCES') {
      throw new CLIError(
        `Permission denied: ${operationName}`,
        ERROR_CODES.PERMISSION_DENIED,
        { systemError: error.code }
      );
    } else if (error.code === 'ENOENT') {
      throw new CLIError(
        `Path not found: ${operationName}`,
        ERROR_CODES.CREATION_FAILED,
        { systemError: error.code }
      );
    } else if (error.code === 'ENOSPC') {
      throw new CLIError(
        'Not enough disk space',
        ERROR_CODES.CREATION_FAILED,
        { systemError: error.code }
      );
    }
    
    throw new CLIError(
      `${operationName} failed: ${error.message}`,
      ERROR_CODES.CREATION_FAILED,
      { systemError: error.code || 'UNKNOWN' }
    );
  }
}
