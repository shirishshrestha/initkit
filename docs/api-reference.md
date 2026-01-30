# InitKit CLI - API Reference ## Table of Contents
- [Public API](#public-api)
- [CLI Commands](#cli-commands)
- [Validation Functions](#validation-functions)
- [Error Handling](#error-handling)
- [Utility Functions](#utility-functions) ## Public API InitKit can be used programmatically in your Node.js applications. ### Installation ```bash
npm install initkit
``` ### Import ```javascript
import { createProject, getQuestions } from 'initkit';
``` --- ## `createProject(answers, options)` Create a new project programmatically. ### Parameters #### `answers` (Object) - Required
Project configuration object. **Properties:**
- `projectName` (string) - Name of the project
- `projectType` (string) - Type: 'frontend' | 'backend' | 'fullstack' | 'library'
- `frontend` (string, optional) - Frontend framework
- `backend` (string, optional) - Backend framework
- `database` (string, optional) - Database type
- `language` (string) - 'typescript' | 'javascript'
- `folderStructure` (string, optional) - Folder organization
- `styling` (string, optional) - CSS solution
- `features` (Array<string>) - Development tools
- `additionalLibraries` (Array<string>) - Extra libraries
- `packageManager` (string) - 'npm' | 'yarn' | 'pnpm'
- `useGit` (boolean) - Initialize Git
- `installDependencies` (boolean) - Install deps automatically #### `options` (Object) - Optional **Properties:**
- `verbose` (boolean) - Show detailed output (default: false)
- `projectPath` (string) - Custom project path ### Returns `Promise<void>` - Resolves when project is created ### Throws - `CLIError` - On validation or creation failure ### Example ```javascript
import { createProject } from 'initkit'; try { await createProject({ projectName: 'my-app', projectType: 'frontend', frontend: 'react', language: 'typescript', packageManager: 'npm', useGit: true, installDependencies: true, features: ['eslint', 'prettier'], additionalLibraries: ['axios'] }, { verbose: true }); console.log('Project created!');
} catch (error) { console.error('Failed:', error.message);
}
``` --- ## `getQuestions(initialProjectName)` Get interactive prompt questions for inquirer. ### Parameters #### `initialProjectName` (string) - Optional
Pre-filled project name (skips name prompt if provided) ### Returns `Array<Object>` - Array of Inquirer question objects ### Example ```javascript
import inquirer from 'inquirer';
import { getQuestions } from 'initkit'; const questions = getQuestions('my-project');
const answers = await inquirer.prompt(questions);
console.log(answers);
``` --- ## Validation Functions Import from `src/utils/validation.js` ### `validateProjectName(name)` Validate project name against npm package naming rules. **Parameters:**
- `name` (string) - Project name to validate **Returns:**
```javascript
{ valid: boolean, errors: string[]
}
``` **Example:**
```javascript
import { validateProjectName } from 'initkit/src/utils/validation.js'; const result = validateProjectName('my-project');
if (!result.valid) { console.error('Invalid:', result.errors);
}
``` ### `checkDirectoryExists(projectName, basePath)` Check if directory already exists. **Parameters:**
- `projectName` (string) - Name of the project
- `basePath` (string, optional) - Base path (default: cwd) **Returns:**
```javascript
{ exists: boolean, path: string
}
``` **Example:**
```javascript
import { checkDirectoryExists } from 'initkit/src/utils/validation.js'; const check = checkDirectoryExists('my-project');
if (check.exists) { console.error(`Directory exists: ${check.path}`);
}
``` ### `sanitizeProjectName(name)` Fix common project name issues. **Parameters:**
- `name` (string) - Project name to sanitize **Returns:**
- `string` - Sanitized name **Transformations:**
- Convert to lowercase
- Replace spaces with hyphens
- Remove invalid characters
- Trim to 214 characters **Example:**
```javascript
import { sanitizeProjectName } from 'initkit/src/utils/validation.js'; const clean = sanitizeProjectName('My Project Name!');
console.log(clean); // "my-project-name"
``` ### `suggestProjectName(name)` Suggest alternative project name. **Parameters:**
- `name` (string) - Original name **Returns:**
- `string` - Suggested name **Example:**
```javascript
import { suggestProjectName } from 'initkit/src/utils/validation.js'; const suggestion = suggestProjectName('Invalid Name!');
console.log(suggestion); // "invalid-name"
``` ### `validateAllInputs(inputs)` Validate multiple inputs at once. **Parameters:**
- `inputs` (Object) - Object with input values **Returns:**
```javascript
{ valid: boolean, errors: { [key: string]: string[] }
}
``` **Example:**
```javascript
import { validateAllInputs } from 'initkit/src/utils/validation.js'; const result = validateAllInputs({ projectName: 'my-project', checkDirectory: true
}); if (!result.valid) { console.error('Errors:', result.errors);
}
``` --- ## Error Handling Import from `src/utils/errorHandler.js` ### `CLIError` Class Custom error class for CLI operations. **Constructor:**
```javascript
new CLIError(message, code, details)
``` **Parameters:**
- `message` (string) - Error message
- `code` (string) - Error code from ERROR_CODES
- `details` (Object, optional) - Additional context **Properties:**
- `message` (string) - Error message
- `name` (string) - 'CLIError'
- `code` (string) - Error code
- `details` (Object) - Error details **Example:**
```javascript
import { CLIError, ERROR_CODES } from 'initkit/src/utils/errorHandler.js'; throw new CLIError( 'Project creation failed', ERROR_CODES.CREATION_FAILED, { step: 'file generation' }
);
``` ### `ERROR_CODES` Available error codes: ```javascript
{ VALIDATION_ERROR: 'VALIDATION_ERROR', DIRECTORY_EXISTS: 'DIRECTORY_EXISTS', CREATION_FAILED: 'CREATION_FAILED', INSTALL_FAILED: 'INSTALL_FAILED', GIT_INIT_FAILED: 'GIT_INIT_FAILED', PERMISSION_DENIED: 'PERMISSION_DENIED', NETWORK_ERROR: 'NETWORK_ERROR', UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}
``` ### `displayError(error, context)` Display formatted error message. **Parameters:**
- `error` (Error | CLIError) - Error to display
- `context` (Object, optional) - Additional context **Example:**
```javascript
import { displayError } from 'initkit/src/utils/errorHandler.js'; try { // operation
} catch (error) { displayError(error, { projectName: 'my-app' });
}
``` ### `rollbackProject(projectPath, options)` Remove incomplete project on failure. **Parameters:**
- `projectPath` (string) - Path to project directory
- `options` (Object, optional) - `verbose` (boolean) - Show detailed output **Returns:**
- `Promise<void>` **Example:**
```javascript
import { rollbackProject } from 'initkit/src/utils/errorHandler.js'; try { // create project
} catch (error) { await rollbackProject('/path/to/project', { verbose: true }); throw error;
}
``` ### `withErrorHandling(operation, options)` Wrap async operation with error handling. **Parameters:**
- `operation` (Function) - Async function to execute
- `options` (Object) - `projectPath` (string) - Path for rollback - `rollback` (boolean) - Enable rollback - `errorCode` (string) - Error code to use - `context` (Object) - Error context **Returns:**
- `Promise<any>` - Result of operation **Example:**
```javascript
import { withErrorHandling, ERROR_CODES } from 'initkit/src/utils/errorHandler.js'; const result = await withErrorHandling( async () => { // risky operation return someValue; }, { projectPath: '/path/to/project', rollback: true, errorCode: ERROR_CODES.CREATION_FAILED, context: { step: 'generation' } }
);
``` ### `setupGracefulShutdown(projectPath)` Handle process termination signals. **Parameters:**
- `projectPath` (string) - Path to clean up on shutdown **Example:**
```javascript
import { setupGracefulShutdown } from 'initkit/src/utils/errorHandler.js'; setupGracefulShutdown('/path/to/project');
// Now SIGINT and SIGTERM will cleanup the project
``` ### `safeFileOperation(operation, operationName)` Wrap file operations with error handling. **Parameters:**
- `operation` (Function) - File operation to wrap
- `operationName` (string) - Description for errors **Returns:**
- `Promise<any>` - Result of operation **Throws:**
- `CLIError` - With appropriate error code **Example:**
```javascript
import { safeFileOperation } from 'initkit/src/utils/errorHandler.js'; await safeFileOperation( () => fs.writeFile('/path/to/file', 'content'), 'Writing config file'
);
``` --- ## Utility Functions ### Package Manager Import from `src/utils/packageManager.js` #### `installDependencies(projectPath, packageManager, options)` Install project dependencies. **Parameters:**
- `projectPath` (string) - Project directory
- `packageManager` (string) - 'npm' | 'yarn' | 'pnpm'
- `options` (Object, optional) - `verbose` (boolean) - Show detailed output **Returns:**
- `Promise<void>` **Example:**
```javascript
import { installDependencies } from 'initkit/src/utils/packageManager.js'; await installDependencies('/path/to/project', 'npm', { verbose: true
});
``` #### `getInstallCommand(packageManager)` Get install command for package manager. **Parameters:**
- `packageManager` (string) - 'npm' | 'yarn' | 'pnpm' **Returns:**
- `string` - Install command **Example:**
```javascript
import { getInstallCommand } from 'initkit/src/utils/packageManager.js'; const cmd = getInstallCommand('yarn');
console.log(cmd); // "yarn"
``` ### Git Operations Import from `src/utils/git.js` #### `initGit(projectPath)` Initialize Git repository. **Parameters:**
- `projectPath` (string) - Project directory **Returns:**
- `Promise<void>` **Example:**
```javascript
import { initGit } from 'initkit/src/utils/git.js'; await initGit('/path/to/project');
``` ### Template Generation Import from `src/utils/templateGenerator.js` #### `generateTemplate(projectPath, config)` Generate project files from templates. **Parameters:**
- `projectPath` (string) - Project directory
- `config` (Object) - Project configuration **Returns:**
- `Promise<void>` **Example:**
```javascript
import { generateTemplate } from 'initkit/src/utils/templateGenerator.js'; await generateTemplate('/path/to/project', { projectType: 'frontend', frontend: 'react', language: 'typescript', // ... other config
});
``` --- ## Type Definitions ### Answer Types ```typescript
interface ProjectAnswers { projectName: string; projectType: 'frontend' | 'backend' | 'fullstack' | 'library'; frontend?: 'react' | 'vue' | 'angular' | 'svelte' | 'nextjs' | 'nuxtjs' | 'vanilla'; backend?: 'express' | 'fastify' | 'koa' | 'nestjs' | 'hapi'; database?: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'none'; language: 'typescript' | 'javascript'; typescriptStrict?: 'strict' | 'moderate' | 'relaxed'; folderStructure?: 'feature-based' | 'type-based' | 'domain-driven' | 'flat'; styling?: 'tailwind' | 'css-modules' | 'styled-components' | 'emotion' | 'sass' | 'css'; additionalLibraries: string[]; features: string[]; packageManager: 'npm' | 'yarn' | 'pnpm'; useGit: boolean; installDependencies: boolean;
}
``` ### Validation Result ```typescript
interface ValidationResult { valid: boolean; errors: string[];
}
``` ### Directory Check Result ```typescript
interface DirectoryCheckResult { exists: boolean; path: string;
}
``` --- ## CLI Commands ### create ```bash
initkit create [project-name] [options]
``` **Aliases:** Default command (can omit 'create') **Options:**
- `-y, --yes` - Skip prompts
- `--ts, --typescript` - Use TypeScript
- `--js, --javascript` - Use JavaScript
- `-t, --template <name>` - Use template
- `--no-git` - Skip Git init
- `--no-install` - Skip install
- `-p, --package-manager <manager>` - Set package manager
- `--verbose` - Detailed output ### list ```bash
initkit list
``` Display available templates and frameworks. ### info ```bash
initkit info
``` Show CLI information. ### version ```bash
initkit --version
# or
initkit -v
``` Display version number. ### help ```bash
initkit --help
# or
initkit -h
# or
initkit create --help
``` Display help information. --- **Next Steps:**
- [User Guide](./user-guide.md)
- [Architecture](./architecture.md)
- [Contributing Guide](../CONTRIBUTING.md)