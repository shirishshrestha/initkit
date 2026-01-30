import chalk from 'chalk';
import validateNpmName from 'validate-npm-package-name';
import fs from 'fs-extra';
import path from 'path';

/**
 * Validate project name against npm package naming rules
 * @param {string} name - Project name to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateProjectName(name) {
  const errors = [];

  // Check if name is provided
  if (!name || name.trim() === '') {
    errors.push('Project name is required');
    return { valid: false, errors };
  }

  // Trim and convert to lowercase for validation
  const trimmedName = name.trim();

  // Check for spaces
  if (trimmedName.includes(' ')) {
    errors.push('Project name cannot contain spaces. Use hyphens instead.');
  }

  // Check length
  if (trimmedName.length > 214) {
    errors.push('Project name must be 214 characters or less');
  }

  if (trimmedName.length === 0) {
    errors.push('Project name cannot be empty');
  }

  // Check if starts with . or _
  if (trimmedName.startsWith('.') || trimmedName.startsWith('_')) {
    errors.push('Project name cannot start with a dot or underscore');
  }

  // Check for uppercase letters
  if (trimmedName !== trimmedName.toLowerCase()) {
    errors.push('Project name must be lowercase');
  }

  // Check for invalid characters
  const invalidChars = /[~'!()*]/;
  if (invalidChars.test(trimmedName)) {
    errors.push('Project name contains invalid characters: ~\'!()*');
  }

  // Use npm's official validator
  const npmValidation = validateNpmName(trimmedName);
  
  if (!npmValidation.validForNewPackages) {
    if (npmValidation.errors) {
      errors.push(...npmValidation.errors);
    }
    if (npmValidation.warnings) {
      errors.push(...npmValidation.warnings);
    }
  }

  return {
    valid: errors.length === 0,
    errors: [...new Set(errors)], // Remove duplicates
  };
}

/**
 * Check if directory already exists
 * @param {string} projectName - Name of the project
 * @param {string} basePath - Base path where project will be created (default: cwd)
 * @returns {Object} - { exists: boolean, path: string }
 */
export function checkDirectoryExists(projectName, basePath = process.cwd()) {
  const projectPath = path.join(basePath, projectName);
  const exists = fs.existsSync(projectPath);

  return {
    exists,
    path: projectPath,
  };
}

/**
 * Validate that the target directory is writable
 * @param {string} dirPath - Directory path to check
 * @returns {Object} - { writable: boolean, error: string }
 */
export async function checkDirectoryWritable(dirPath) {
  try {
    await fs.access(dirPath, fs.constants.W_OK);
    return { writable: true, error: null };
  } catch (error) {
    return {
      writable: false,
      error: `Directory ${dirPath} is not writable`,
    };
  }
}

/**
 * Validate folder structure name
 * @param {string} structure - Folder structure type
 * @returns {boolean}
 */
export function validateFolderStructure(structure) {
  const validStructures = ['feature-based', 'type-based', 'domain-driven', 'flat'];
  return validStructures.includes(structure);
}

/**
 * Format validation errors for display
 * @param {string[]} errors - Array of error messages
 * @returns {string} - Formatted error message
 */
export function formatValidationErrors(errors) {
  if (errors.length === 0) return '';
  
  if (errors.length === 1) {
    return chalk.red(`Error: ${errors[0]}`);
  }

  const errorList = errors.map((err, idx) => `  ${idx + 1}. ${err}`).join('\n');
  return chalk.red(`Invalid project name:\n${errorList}`);
}

/**
 * Sanitize project name by fixing common issues
 * @param {string} name - Project name to sanitize
 * @returns {string} - Sanitized name
 */
export function sanitizeProjectName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-_]/g, '') // Remove invalid characters
    .replace(/^[._]/, '') // Remove leading dots/underscores
    .substring(0, 214); // Limit length
}

/**
 * Suggest an alternative project name if the current one is invalid
 * @param {string} name - Original project name
 * @returns {string} - Suggested name
 */
export function suggestProjectName(name) {
  const sanitized = sanitizeProjectName(name);
  if (sanitized.length === 0) {
    return 'my-awesome-project';
  }
  return sanitized;
}

/**
 * Validate multiple inputs at once
 * @param {Object} inputs - Object with input values to validate
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export function validateAllInputs(inputs) {
  const errors = {};
  let valid = true;

  // Validate project name
  if (inputs.projectName) {
    const nameValidation = validateProjectName(inputs.projectName);
    if (!nameValidation.valid) {
      errors.projectName = nameValidation.errors;
      valid = false;
    }
  }

  // Check directory existence
  if (inputs.projectName && inputs.checkDirectory !== false) {
    const dirCheck = checkDirectoryExists(inputs.projectName);
    if (dirCheck.exists) {
      errors.directory = [`Directory "${inputs.projectName}" already exists`];
      valid = false;
    }
  }

  return { valid, errors };
}
