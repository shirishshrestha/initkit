import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create a temporary test directory
 */
export function createTempDir(name = 'test-project') {
  const tempDir = path.join(__dirname, '..', 'test-output', name);
  fs.ensureDirSync(tempDir);
  return tempDir;
}

/**
 * Clean up a test directory
 */
export function cleanupTempDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.removeSync(dirPath);
  }
}

/**
 * Check if a file exists
 */
export function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Read file content
 */
export function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Check if directory exists
 */
export function dirExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

/**
 * Get all files in a directory recursively
 */
export function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

/**
 * Mock answers for CLI prompts
 */
export const mockAnswers = {
  frontend: {
    projectName: 'test-frontend',
    projectType: 'frontend',
    frontend: 'react',
    language: 'typescript',
    folderStructure: 'feature-based',
    styling: 'tailwind',
    useGit: false,
    installDependencies: false,
    packageManager: 'npm',
    features: ['eslint', 'prettier'],
    additionalLibraries: [],
  },
  backend: {
    projectName: 'test-backend',
    projectType: 'backend',
    backend: 'express',
    language: 'typescript',
    database: 'prisma',
    folderStructure: 'mvc',
    useGit: false,
    installDependencies: false,
    packageManager: 'npm',
    features: ['docker', 'eslint'],
    additionalLibraries: [],
  },
  fullstack: {
    projectName: 'test-fullstack',
    projectType: 'fullstack',
    fullstackType: 'monorepo',
    stack: 'Next.js + Express + MongoDB',
    language: 'typescript',
    useGit: false,
    installDependencies: false,
    packageManager: 'npm',
    features: ['docker'],
    additionalLibraries: [],
  },
  nextjs: {
    projectName: 'test-nextjs',
    projectType: 'frontend',
    frontend: 'nextjs',
    language: 'typescript',
    folderStructure: 'feature-based',
    styling: 'tailwind',
    useGit: false,
    installDependencies: false,
    packageManager: 'npm',
    features: ['eslint', 'prettier'],
    additionalLibraries: [],
  },
};

/**
 * Verify package.json structure
 */
export function verifyPackageJson(dirPath, expectedProps = {}) {
  const packageJsonPath = path.join(dirPath, 'package.json');
  if (!fileExists(packageJsonPath)) {
    throw new Error('package.json not found');
  }

  const packageJson = JSON.parse(readFile(packageJsonPath));

  // Check for expected properties
  Object.entries(expectedProps).forEach(([key, value]) => {
    if (packageJson[key] !== value) {
      throw new Error(`Expected package.json.${key} to be ${value}, got ${packageJson[key]}`);
    }
  });

  return packageJson;
}

/**
 * Verify README exists and contains expected content
 */
export function verifyReadme(dirPath, expectedStrings = []) {
  const readmePath = path.join(dirPath, 'README.md');
  if (!fileExists(readmePath)) {
    throw new Error('README.md not found');
  }

  const readme = readFile(readmePath);
  expectedStrings.forEach((str) => {
    if (!readme.includes(str)) {
      throw new Error(`Expected README to contain "${str}"`);
    }
  });

  return readme;
}

/**
 * Cross-platform path helper
 */
export function normalizePath(filePath) {
  return filePath.split(path.sep).join('/');
}

/**
 * Wait for a promise with timeout
 */
export function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
