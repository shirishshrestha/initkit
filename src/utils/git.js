import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Initialize a Git repository
 * @param {string} projectPath - Path to the project
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
