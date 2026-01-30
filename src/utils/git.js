import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Initialize a Git repository and create first commit
 * 
 * Performs the following operations:
 * 1. Runs `git init` to create a new repository
 * 2. Creates .gitignore file with common patterns (if not exists)
 * 3. Stages all files with `git add .`
 * 4. Creates initial commit with message "Initial commit"
 * 
 * Note: Catches and warns if Git is not installed or initialization fails.
 * 
 * @param {string} projectPath - Absolute path to the project directory
 * @returns {Promise<void>}
 * 
 * @example
 * await initGit('/path/to/my-project');
 * // Creates .git directory and initial commit
 * 
 * @throws {Error} Logs warning but does not throw - Git init is optional
 */
async function initGit(projectPath) {
  try {
    // Initialize git repo
    await execAsync('git init', { cwd: projectPath });

    // Create .gitignore if it doesn't exist
    const gitignorePath = path.join(projectPath, '.gitignore');
    if (!(await fs.pathExists(gitignorePath))) {
      const gitignoreContent = `# Dependencies
node_modules/

# Environment variables
.env
.env.local

# Build outputs
dist/
build/

# Logs
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
`;
      await fs.writeFile(gitignorePath, gitignoreContent);
    }

    // Initial commit
    await execAsync('git add .', { cwd: projectPath });
    await execAsync('git commit -m "Initial commit"', { cwd: projectPath });
  } catch (error) {
    console.warn('Warning: Could not initialize Git repository');
  }
}

export { initGit };
