# Contributing to InitKit

First off, thank you for considering contributing to InitKit! It's people like you that make InitKit such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Adding New Templates](#adding-new-templates)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- **Be respectful** - Treat everyone with respect and kindness
- **Be collaborative** - Work together to improve the project
- **Be open-minded** - Welcome new ideas and perspectives
- **Be constructive** - Provide helpful feedback
- **Be patient** - Remember that everyone is learning

## Getting Started

### Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- Git >= 2.0.0

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/initkit.git
   cd initkit
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/shirishshrestha/initkit.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Link for local testing**
   ```bash
   npm link
   ```

6. **Verify installation**
   ```bash
   initkit --version
   ```

## Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation improvements
- `test/` - Test additions or modifications
- `refactor/` - Code refactoring

### Making Changes

1. **Make your changes** in the appropriate files
2. **Test your changes** locally
3. **Run tests** to ensure nothing breaks
4. **Run linting** to maintain code quality

```bash
# Test your changes
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream changes into your branch
git merge upstream/main
```

## Project Structure

Understanding the codebase:

```
initkit/
├── bin/
│   └── index.js                    # CLI entry point
├── src/
│   ├── cli.js                      # CLI program setup
│   ├── index.js                    # Programmatic API
│   ├── commands/
│   │   └── create.js               # Project creation logic
│   ├── prompts/
│   │   └── questions.js            # Interactive prompts
│   ├── templates/
│   │   ├── nextjs.js               # Next.js template generator
│   │   ├── react.js                # React template generator
│   │   ├── vue.js                  # Vue template generator
│   │   ├── express.js              # Express template generator
│   │   └── fullstack.js            # Full-stack template generator
│   └── utils/
│       ├── errorHandler.js         # Error handling & rollback
│       ├── validation.js           # Input validation
│       ├── templateGenerator.js    # Template generation
│       ├── packageManager.js       # Package manager operations
│       └── git.js                  # Git operations
├── __tests__/                      # Test files
│   ├── unit/                       # Unit tests
│   ├── integration/                # Integration tests
│   └── helpers.js                  # Test utilities
├── docs/                           # Documentation files
└── package.json                    # Project metadata
```

### Key Files

- **bin/index.js** - Entry point for the CLI
- **src/cli.js** - Commander setup and command definitions
- **src/commands/create.js** - Core project creation logic
- **src/prompts/questions.js** - Interactive prompt definitions
- **src/utils/errorHandler.js** - Error handling with rollback
- **src/utils/validation.js** - Input validation utilities

## Coding Guidelines

### General Principles

- **ES Modules** - Use ES module syntax (`import`/`export`)
- **File Extensions** - Always include `.js` in imports
- **Async/Await** - Prefer async/await over callbacks
- **Error Handling** - Use try/catch and custom error classes
- **Comments** - Write JSDoc comments for functions
- **Naming** - Use descriptive, camelCase names

### Code Style

We use ESLint and Prettier for consistent code style:

```javascript
// ✅ Good
export async function generateTemplate(projectPath, config) {
  try {
    await fs.ensureDir(projectPath);
    // ... implementation
  } catch (error) {
    throw new CLIError('Failed to generate template', ERROR_CODES.CREATION_FAILED);
  }
}

// ❌ Bad
export function generateTemplate(projectPath, config, callback) {
  fs.mkdir(projectPath, (err) => {
    if (err) callback(err);
    // ... implementation
  });
}
```

### JSDoc Comments

All functions should have JSDoc comments:

```javascript
/**
 * Generate project files from templates
 * @param {string} projectPath - Path to the project directory
 * @param {Object} config - User's project configuration
 * @param {string} config.projectType - Type of project (frontend/backend/fullstack)
 * @param {string} config.framework - Framework to use
 * @returns {Promise<void>}
 * @throws {CLIError} If template generation fails
 */
export async function generateTemplate(projectPath, config) {
  // Implementation
}
```

### Error Handling

Use the custom error classes:

```javascript
import { CLIError, ERROR_CODES } from './utils/errorHandler.js';

// Throw specific errors
throw new CLIError(
  'Invalid project name',
  ERROR_CODES.VALIDATION_ERROR,
  { suggestion: 'my-project' }
);

// Use withErrorHandling wrapper
await withErrorHandling(
  async () => {
    // Your operation
  },
  {
    projectPath,
    rollback: true,
    errorCode: ERROR_CODES.CREATION_FAILED,
  }
);
```

## Testing

We use Jest for testing with ES module support.

### Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- __tests__/unit/validation.test.js
```

### Writing Tests

Place tests in the `__tests__` directory:

```javascript
import { validateProjectName } from '../src/utils/validation.js';

describe('validateProjectName', () => {
  test('should validate correct project names', () => {
    expect(validateProjectName('my-project').valid).toBe(true);
    expect(validateProjectName('my-awesome-app').valid).toBe(true);
  });

  test('should reject invalid names', () => {
    expect(validateProjectName('My Project').valid).toBe(false);
    expect(validateProjectName('@invalid').valid).toBe(false);
  });
});
```

### Test Coverage

We aim for at least 40% code coverage:

- **Unit tests** - Test individual functions
- **Integration tests** - Test complete workflows
- **Error scenarios** - Test error handling
- **Edge cases** - Test boundary conditions

## Documentation

### Code Documentation

- Add JSDoc comments to all exported functions
- Explain complex algorithms or logic
- Document parameters, return values, and exceptions

### User Documentation

When adding new features:

1. Update **README.md** with usage examples
2. Add entries to relevant documentation files
3. Update the **QUESTION_FLOW.md** if prompts change
4. Create examples in **docs/examples.md**

### Documentation Files

- **README.md** - Main project documentation
- **CONTRIBUTING.md** - This file
- **docs/user-guide.md** - Detailed usage guide
- **docs/architecture.md** - Technical architecture
- **docs/examples.md** - Real-world examples
- **QUESTION_FLOW.md** - Prompt flow diagram

## Submitting Changes

### Before Submitting

1. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

2. **Update documentation** if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test additions or modifications
- `chore:` - Build process or tooling changes

**Examples:**
```
feat(templates): add Svelte template support
fix(validation): correct regex for project names
docs(readme): update installation instructions
test(validation): add tests for sanitizeProjectName
```

### Creating a Pull Request

1. **Push to your fork**
   ```bash
   git push origin feature/my-new-feature
   ```

2. **Open a Pull Request** on GitHub

3. **Fill out the PR template** with:
   - Description of changes
   - Related issue numbers
   - Screenshots (if applicable)
   - Checklist completion

4. **Wait for review** - Maintainers will review your PR

5. **Address feedback** - Make requested changes

6. **Merge** - Once approved, your PR will be merged

## Adding New Templates

To add a new framework or template:

### 1. Create Template Generator

Create a new file in `src/templates/`:

```javascript
// src/templates/svelte.js
import fs from 'fs-extra';
import path from 'path';

export async function generateSvelteTemplate(projectPath, config) {
  // Create directory structure
  await fs.ensureDir(path.join(projectPath, 'src'));
  
  // Generate files
  const appContent = `<script>
  // Your Svelte app
</script>

<main>
  <h1>Hello {name}!</h1>
</main>`;

  await fs.writeFile(
    path.join(projectPath, 'src', 'App.svelte'),
    appContent
  );
  
  // Generate package.json
  const packageJson = {
    name: config.projectName,
    version: '1.0.0',
    scripts: {
      dev: 'vite dev',
      build: 'vite build',
    },
    devDependencies: {
      '@sveltejs/vite-plugin-svelte': '^3.0.0',
      svelte: '^4.0.0',
      vite: '^5.0.0',
    },
  };
  
  await fs.writeJSON(
    path.join(projectPath, 'package.json'),
    packageJson,
    { spaces: 2 }
  );
}
```

### 2. Update Template Generator

Add to `src/utils/templateGenerator.js`:

```javascript
import { generateSvelteTemplate } from '../templates/svelte.js';

// In generateFrontendFiles function:
case 'svelte':
  await generateSvelteTemplate(projectPath, config);
  break;
```

### 3. Update Questions

Add to `src/prompts/questions.js`:

```javascript
{
  type: 'list',
  name: 'frontend',
  message: 'Which frontend framework?',
  choices: [
    { name: 'React', value: 'react' },
    { name: 'Vue.js', value: 'vue' },
    { name: 'Svelte', value: 'svelte' }, // Add here
    // ...
  ],
}
```

### 4. Add Tests

Create tests in `__tests__/templates/`:

```javascript
import { generateSvelteTemplate } from '../src/templates/svelte.js';

describe('Svelte Template', () => {
  test('should generate Svelte project structure', async () => {
    // Test implementation
  });
});
```

### 5. Update Documentation

- Add to README.md framework list
- Update docs/examples.md with Svelte example
- Document any special configuration

## Getting Help

If you need help:

- **GitHub Discussions** - Ask questions
- **GitHub Issues** - Report bugs or request features
- **Discord/Slack** - Join our community (if available)
- **Email** - Contact maintainers

## Recognition

Contributors will be:
- Listed in our README.md
- Mentioned in release notes
- Given credit in commit history

Thank you for contributing to InitKit! 🚀
