# Architecture Documentation

## System Overview

InitKit is a CLI tool that generates fully-configured project scaffolds through an interactive question flow. The architecture follows a modular design with clear separation of concerns, making it easy to extend with new frameworks and features.

### Design Philosophy

1. **Interactive First**: Prioritize user experience with intelligent prompts and real-time validation
2. **Fail-Safe**: Automatic rollback on errors ensures clean state
3. **Extensible**: Plugin-like template system makes adding new frameworks simple
4. **Opinionated Defaults**: Sensible defaults while allowing full customization
5. **Developer Experience**: Helpful error messages, colored output, and progress indicators

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLI Entry                            │
│                      (src/cli.js)                           │
│  • Commander.js setup                                       │
│  • Command registration (create, info, list)               │
│  • Help text and usage information                         │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Command Layer                             │
│                  (src/commands/)                            │
│  • Orchestrates the entire project creation workflow       │
│  • Handles CLI arguments and options                       │
│  • Invokes prompts, templates, and utilities               │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Prompt Layer                              │
│                  (src/prompts/)                             │
│  • Dynamic question generation                              │
│  • Conditional logic based on user selections              │
│  • Real-time input validation and feedback                 │
│  • Smart defaults based on context                         │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Template Layer                             │
│                  (src/templates/)                           │
│  • Framework-specific generators                            │
│  • File and folder structure creation                       │
│  • Configuration file generation                            │
│  • Package.json with correct dependencies                  │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Utility Layer                             │
│                   (src/utils/)                              │
│  • Validation (input, directories, npm names)              │
│  • Error handling (CLIError, rollback, graceful shutdown) │
│  • Package management (npm/yarn/pnpm)                      │
│  • Git operations (init, commit)                           │
│  • Template generation coordination                        │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. CLI Layer (`src/cli.js`)

**Responsibility**: Command-line interface setup and command routing

**Key Components**:
- **Commander.js Program**: Main CLI program configuration
- **Command Definitions**: `create`, `info`, `list` commands
- **Help System**: Enhanced help text with examples and documentation links
- **Version Management**: Package version display

**Data Flow**:
```
User Input → Commander.js → Command Handler → Response
```

**Key Features**:
- Colored, formatted help text with boxes and icons
- Command-specific examples and usage patterns
- Graceful error handling for unknown commands

---

### 2. Command Layer (`src/commands/create.js`)

**Responsibility**: Orchestrate the entire project creation workflow

**Key Components**:
- **createProject()**: Main orchestration function
- **Spinner/Progress**: Visual feedback during operations
- **Error Recovery**: Rollback on failure

**Workflow**:
```
1. Validate & Create Directory
   ↓
2. Generate Template Files
   ↓
3. Install Dependencies
   ↓
4. Initialize Git (if selected)
   ↓
5. Display Success Message
```

**Error Handling**:
- Wrapped in `withErrorHandling()` for automatic rollback
- Safe file operations with transaction-like behavior
- Context-aware error messages with recovery suggestions

**Dependencies**:
- Template Generator
- Package Manager
- Git Utilities
- Error Handler

---

### 3. Prompt Layer (`src/prompts/questions.js`)

**Responsibility**: Generate dynamic, conditional questions for user input

**Key Components**:
- **getQuestions()**: Returns array of Inquirer.js question objects
- **Validation Functions**: Real-time input validation
- **Transformer Functions**: Visual feedback during typing
- **Conditional Logic**: Show/hide questions based on previous answers

**Question Flow**:
```
Project Type
   ↓
Project Name (with validation)
   ↓
Framework Selection (conditional)
   ├─ Frontend → React/Vue/Next.js/etc.
   ├─ Backend → Express/NestJS/Fastify/etc.
   └─ Full Stack → Both + Architecture
   ↓
Language Choice (TypeScript/JavaScript)
   ↓
Additional Features
   ├─ Styling Solutions
   ├─ Testing Framework
   ├─ Linting/Formatting
   └─ Additional Tools
   ↓
Configuration
   ├─ Package Manager
   ├─ Git Initialization
   └─ Folder Structure
```

**Validation Strategy**:
- **Project Name**: npm package name rules + directory existence check
- **Visual Feedback**: Green ✓ for valid, Red ✗ for invalid, Yellow ⚠ for warnings
- **Suggestions**: Automatic corrections for common mistakes
- **Real-time**: Validation runs as user types

---

### 4. Template Layer (`src/templates/`)

**Responsibility**: Generate framework-specific project files

**Architecture Pattern**: Factory Pattern

**Template Structure**:
```
templates/
├── nextjs.js       # Next.js template generator
├── react.js        # React (Vite) template generator
├── vue.js          # Vue template generator
├── express.js      # Express backend template generator
└── fullstack.js    # Full-stack monorepo template generator
```

**Template Generator Interface**:
```javascript
/**
 * @param {string} projectPath - Absolute path to project directory
 * @param {Object} config - User configuration object
 * @returns {Promise<void>}
 */
async function generateFrameworkTemplate(projectPath, config)
```

**Common Template Operations**:
1. **Directory Creation**: `src/`, `public/`, `tests/`, etc.
2. **File Generation**: 
   - `package.json` with correct dependencies
   - Configuration files (tsconfig, vite.config, etc.)
   - Entry files (index.html, App.tsx, server.js, etc.)
   - README.md with getting started instructions
3. **Conditional Features**:
   - TypeScript vs JavaScript
   - Different folder structures
   - Optional features (Docker, CI/CD, etc.)

**Example: React Template Flow**:
```
generateReactTemplate()
   ↓
Create directories (src, public, tests)
   ↓
Generate package.json with React + Vite dependencies
   ↓
Generate vite.config file
   ↓
Generate App component (TSX or JSX)
   ↓
Generate index.html entry point
   ↓
Generate TypeScript config (if selected)
   ↓
Generate README with instructions
```

---

### 5. Utility Layer (`src/utils/`)

#### 5.1 Validation (`validation.js`)

**Responsibility**: Input validation and sanitization

**Key Functions**:
- `validateProjectName()`: Check npm naming rules
- `checkDirectoryExists()`: Prevent overwriting existing projects
- `sanitizeProjectName()`: Clean invalid characters
- `suggestProjectName()`: Auto-correct common mistakes

**Validation Rules**:
- No uppercase letters
- No spaces or special characters (except hyphens)
- Cannot start with dot or underscore
- Must not be empty
- Must not be a reserved npm name

#### 5.2 Error Handler (`errorHandler.js`)

**Responsibility**: Centralized error handling with rollback capability

**Key Components**:
- **CLIError Class**: Custom error with code and context
- **Error Codes**: Predefined error types
- **Rollback System**: Automatic cleanup on failure
- **Graceful Shutdown**: Handle Ctrl+C and other interrupts

**Error Handling Architecture**:
```
Error Occurs
   ↓
CLIError thrown with code + context
   ↓
withErrorHandling() wrapper catches error
   ↓
displayError() shows formatted error
   ↓
displayErrorSuggestions() provides fixes
   ↓
rollbackProject() cleans up partial changes
   ↓
process.exit(1)
```

**Rollback Strategy**:
1. Track created files/directories
2. On error, delete in reverse order
3. Restore original state
4. Log rollback actions in verbose mode

**Error Types**:
- `VALIDATION_ERROR`: Invalid input
- `DIRECTORY_EXISTS`: Path collision
- `CREATION_FAILED`: File system error
- `INSTALL_FAILED`: Dependency installation error
- `GIT_INIT_FAILED`: Git initialization error
- `PERMISSION_DENIED`: Insufficient permissions
- `NETWORK_ERROR`: Network-related failures
- `UNKNOWN_ERROR`: Unexpected errors

#### 5.3 Template Generator (`templateGenerator.js`)

**Responsibility**: Coordinate template generation and feature addition

**Key Functions**:
- `generateTemplate()`: Main coordinator
- `generateFrontendFiles()`: Route to correct frontend template
- `generateBackendFiles()`: Route to correct backend template
- `generateFullStackFiles()`: Generate monorepo structure
- `generateLibraryFiles()`: Generate npm package structure
- `generateGitignore()`: Framework-specific ignore patterns
- `addFeatures()`: Add Docker, CI/CD, Git hooks

**Routing Logic**:
```javascript
generateTemplate(projectPath, config)
   ↓
switch (config.projectType)
   ├─ 'frontend' → generateFrontendFiles()
   │                  ↓
   │              switch (config.frontend)
   │                  ├─ 'react' → generateReactTemplate()
   │                  ├─ 'vue' → generateVueTemplate()
   │                  └─ 'nextjs' → generateNextjsTemplate()
   │
   ├─ 'backend' → generateBackendFiles()
   ├─ 'fullstack' → generateFullStackFiles()
   └─ 'library' → generateLibraryFiles()
```

#### 5.4 Package Manager (`packageManager.js`)

**Responsibility**: Dependency installation abstraction

**Supported Package Managers**:
- npm
- yarn
- pnpm
- bun

**Key Functions**:
- `installDependencies()`: Install based on package manager choice
- `detectPackageManager()`: Auto-detect from lock files
- `getInstallCommand()`: Return correct install command

**Installation Flow**:
```
installDependencies(projectPath, packageManager)
   ↓
Detect or use specified package manager
   ↓
Change to project directory
   ↓
Execute install command with spinner
   ↓
Handle success/failure with context
```

#### 5.5 Git Operations (`git.js`)

**Responsibility**: Git repository initialization and first commit

**Key Functions**:
- `initGit()`: Initialize repository and create first commit
- `checkGitInstalled()`: Verify Git is available

**Git Flow**:
```
initGit(projectPath)
   ↓
Check if Git is installed
   ↓
git init
   ↓
git add .
   ↓
git commit -m "Initial commit from InitKit"
```

---

## Data Flow

### End-to-End Project Creation Flow

```
1. User runs: initkit my-app
   │
   ▼
2. CLI parses command and options
   │
   ▼
3. Interactive prompts collect configuration
   │  • Project type
   │  • Framework selection
   │  • Language choice
   │  • Additional features
   │  • Package manager
   │
   ▼
4. Validation
   │  • Check project name validity
   │  • Check directory doesn't exist
   │  • Validate all inputs
   │
   ▼
5. Create project directory
   │
   ▼
6. Generate template files
   │  • Route to correct template generator
   │  • Create folder structure
   │  • Generate configuration files
   │  • Write source code files
   │  • Create package.json
   │  • Add .gitignore
   │
   ▼
7. Install dependencies
   │  • Use selected package manager
   │  • Show progress spinner
   │
   ▼
8. Initialize Git (if selected)
   │  • git init
   │  • Create first commit
   │
   ▼
9. Display success message
   │  • Show next steps
   │  • Provide commands to run
   │
   ▼
10. Exit

[If error occurs at any step]
   ↓
Error Handler
   ↓
Display error + suggestions
   ↓
Rollback (delete created files)
   ↓
Exit with code 1
```

### Configuration Object Structure

The configuration object flows through the entire system:

```javascript
{
  // Basic Info
  projectName: 'my-app',
  projectType: 'frontend',
  
  // Framework Choices
  frontend: 'react',           // or 'vue', 'nextjs', etc.
  backend: 'express',          // or 'nestjs', 'fastify', etc.
  
  // Language & Tools
  language: 'typescript',      // or 'javascript'
  packageManager: 'npm',       // or 'yarn', 'pnpm', 'bun'
  
  // Additional Features
  features: ['docker', 'github-actions', 'husky'],
  styling: 'tailwind',
  testing: 'jest',
  linting: true,
  
  // Configuration
  folderStructure: 'feature-based',
  gitInit: true,
  
  // Full-Stack Specific
  fullstackType: 'monorepo',   // or 'traditional'
  stack: 'MERN',               // or 'PERN', 'T3', etc.
  
  // Computed Properties
  typescript: true,            // Derived from language
  monorepo: false,             // Derived from fullstackType
}
```

---

## Testing Architecture

### Test Structure

```
tests/
├── unit/               # Unit tests for individual functions
│   ├── validation.test.js
│   ├── errorHandler.test.js
│   └── packageManager.test.js
│
└── integration/        # Integration tests for full workflows
    └── create.test.js  # End-to-end project creation
```

### Testing Strategy

1. **Unit Tests**: Test individual utilities in isolation
   - Mock file system operations
   - Test validation logic
   - Test error handling

2. **Integration Tests**: Test complete workflows
   - Create real project structures in temp directories
   - Verify generated files exist and have correct content
   - Test error rollback functionality
   - Clean up after tests

### Mock Strategy

- **File System**: Use `fs-extra` with temp directories
- **User Input**: Mock Inquirer.js prompts
- **Child Processes**: Mock `exec` for git and npm commands

### Coverage Goals

- **Overall**: 40%+ (currently at 44%)
- **Critical Paths**: 80%+ (validation, error handling, template generation)
- **Less Critical**: 30%+ (CLI output, styling, minor utilities)

---

## Extension Points

### Adding a New Framework Template

1. **Create Template File**: `src/templates/my-framework.js`

```javascript
/**
 * Generate My Framework template
 * @param {string} projectPath - Project directory path
 * @param {Object} config - User configuration
 */
export async function generateMyFrameworkTemplate(projectPath, config) {
  // Create directories
  await fs.ensureDir(path.join(projectPath, 'src'));
  
  // Generate package.json
  const packageJson = {
    name: config.projectName,
    version: '1.0.0',
    dependencies: {
      'my-framework': '^1.0.0',
    },
  };
  
  await fs.writeJSON(
    path.join(projectPath, 'package.json'),
    packageJson,
    { spaces: 2 }
  );
  
  // Generate source files
  // ...
}
```

2. **Register in Template Generator**: `src/utils/templateGenerator.js`

```javascript
import { generateMyFrameworkTemplate } from '../templates/my-framework.js';

async function generateFrontendFiles(projectPath, config) {
  const framework = config.frontend;
  
  switch (framework) {
    case 'my-framework':
      await generateMyFrameworkTemplate(projectPath, config);
      break;
    // ... other cases
  }
}
```

3. **Add to Prompts**: `src/prompts/questions.js`

```javascript
{
  type: 'list',
  name: 'frontend',
  message: 'Choose your frontend framework:',
  choices: [
    { name: 'My Framework', value: 'my-framework' },
    // ... other choices
  ],
}
```

4. **Add Tests**: `tests/unit/templates/my-framework.test.js`

```javascript
describe('My Framework Template', () => {
  it('should generate correct project structure', async () => {
    // Test implementation
  });
});
```

5. **Update Documentation**: Add to README.md supported frameworks list

### Adding a New Feature

1. **Create Feature Function** in `src/utils/templateGenerator.js`:

```javascript
async function generateMyFeature(projectPath, config) {
  // Implementation
}
```

2. **Register in `addFeatures()`**:

```javascript
async function addFeatures(projectPath, config) {
  if (config.features.includes('my-feature')) {
    await generateMyFeature(projectPath, config);
  }
}
```

3. **Add to Prompts** as checkbox option

4. **Add Dependencies** to package.json in template

---

## Key Design Decisions

### 1. Why Inquirer.js for Prompts?

- **Rich UI**: Lists, checkboxes, validation
- **Conditional Logic**: Dynamic question flow
- **Real-time Feedback**: Transformers for visual feedback
- **Well-maintained**: Active community and good docs

### 2. Why Commander.js for CLI?

- **Standard**: De facto standard for Node.js CLIs
- **Clean API**: Simple command/option definition
- **Help Generation**: Automatic help text
- **Version Management**: Built-in version handling

### 3. Why Template-per-Framework?

- **Maintainability**: Each template is self-contained
- **Flexibility**: Different frameworks have different needs
- **Testing**: Easier to test individual templates
- **Extension**: Adding new frameworks is straightforward

### 4. Why Error Rollback?

- **Clean State**: Never leave partial projects
- **User Trust**: Users can retry without manual cleanup
- **Professional**: Production-grade error handling

### 5. Why Separate Utility Modules?

- **Single Responsibility**: Each utility has one job
- **Testability**: Easy to unit test in isolation
- **Reusability**: Utilities can be shared across templates
- **Clarity**: Clear where functionality lives

---

## Performance Considerations

### File Operations

- Use `fs-extra` for atomic operations
- Batch file writes when possible
- Use streaming for large files

### Dependency Installation

- Longest operation (~30-60s for typical project)
- Show progress spinner
- Allow user to skip with `--no-install` flag

### Git Operations

- Fast operations (~1-2s)
- Optional (can be skipped)

### Template Generation

- Fast operations (~1-5s)
- Most time spent on file I/O
- Minimize redundant file reads

---

## Security Considerations

### Input Validation

- Sanitize all user inputs
- Prevent directory traversal (no `../` in project names)
- Validate npm package names
- Check for reserved/unsafe names

### File Operations

- Check permissions before writing
- Never overwrite existing directories
- Use safe file operations with error handling

### Dependency Installation

- Use exact versions in generated package.json
- No untrusted sources
- User controls package manager

### Code Generation

- No eval() or dynamic code execution
- Templates are static/pre-defined
- No injection vulnerabilities

---

## Future Enhancements

### Planned Features

1. **Plugin System**: Allow third-party templates
2. **Template Marketplace**: Share custom templates
3. **Configuration Presets**: Save/load configurations
4. **Remote Templates**: Pull templates from GitHub
5. **Interactive Template Editor**: Visual template builder
6. **AI Suggestions**: Recommend frameworks based on project description
7. **Migration Tools**: Upgrade existing projects
8. **Multi-language Support**: i18n for prompts and docs

### Architecture Improvements

1. **Event System**: Pub/sub for template hooks
2. **Dependency Injection**: Easier testing and mocking
3. **Configuration Schema**: JSON Schema validation
4. **Template Composition**: Mix and match template features
5. **Incremental Generation**: Add features to existing projects

---

## Debugging Tips

### Verbose Mode

Run with `--verbose` flag to see detailed output:

```bash
initkit my-app --verbose
```

Shows:
- File operations
- Command executions
- Validation steps
- Rollback actions

### Common Issues

1. **Permission Errors**: Run with appropriate permissions
2. **Git Not Found**: Install Git and add to PATH
3. **Network Errors**: Check internet connection for npm install
4. **Directory Exists**: Choose different name or remove existing directory

### Testing Locally

```bash
# Link package locally
npm link

# Test command
initkit test-project --verbose

# Unlink when done
npm unlink -g initkit
```

---

## Contributing to Architecture

When contributing new features:

1. **Follow Patterns**: Match existing code structure
2. **Add Tests**: Maintain coverage standards
3. **Update Docs**: Document new components/features
4. **JSDoc Comments**: Document all functions
5. **Error Handling**: Use CLIError with appropriate codes
6. **Validation**: Validate inputs early
7. **Rollback**: Ensure cleanup on errors

---

## References

- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Inquirer.js Documentation](https://github.com/SBoudrias/Inquirer.js)
- [fs-extra Documentation](https://github.com/jprichardson/node-fs-extra)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [CLI Guidelines](https://clig.dev/)

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintained By**: InitKit Team
