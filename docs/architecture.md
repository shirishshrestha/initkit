# 🏗️ Architecture

> **Technical Documentation** | Understanding InitKit's internal structure and design patterns

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Module Responsibilities](#module-responsibilities)
- [Error Handling Strategy](#error-handling-strategy)
- [Extension Points](#extension-points)
- [Best Practices](#best-practices)

---

## 🎯 Overview InitKit CLI is built using a modular architecture that separates concerns and makes the codebase maintainable and extensible. The architecture follows these principles: 1. **Separation of Concerns** - Each module has a single, well-defined purpose
2. **ES Modules** - Modern JavaScript module system
3. **Error First** - Comprehensive error handling with rollback capabilities
4. **Progressive Enhancement** - Start simple, add complexity as needed
5. **User Experience First** - Clear feedback and helpful error messages

## 📁 Project Structure ```
initkit/
├── bin/
│ └── index.js # CLI entry point
├── src/
│ ├── cli.js # Main CLI program setup
│ ├── index.js # Programmatic API
│ ├── commands/
│ │ └── create.js # Create project command
│ ├── prompts/
│ │ └── questions.js # Interactive prompts
│ └── utils/
│ ├── validation.js # Input validation
│ ├── errorHandler.js # Error handling & rollback
│ ├── templateGenerator.js # File generation
│ ├── packageManager.js # Package installation
│ └── git.js # Git operations
├── templates/ # Project templates
├── docs/ # Documentation
├── __tests__/ # Tests
├── package.json
└── README.md
```

## ⚙️ Core Components ### 1. Entry Point (`bin/index.js`) **Purpose:** Minimal entry point that delegates to main CLI logic **Features:**
- Shebang for direct execution
- Simple import of main CLI module ```javascript
#!/usr/bin/env node
import '../src/cli.js';
``` ### 2. CLI Program (`src/cli.js`) **Purpose:** Command-line interface setup and orchestration **Responsibilities:**
- Define commands and options using Commander.js
- Display banner and help information
- Orchestrate the project creation flow
- Handle top-level error catching
- Setup graceful shutdown handlers **Key Features:**
- Multiple commands (create, list, info)
- Rich option parsing
- Interactive vs. non-interactive modes
- Error display with context ### 3. Commands (`src/commands/`) #### `create.js` **Purpose:** Execute project creation workflow **Flow:**
1. Validate inputs
2. Create project directory
3. Generate files from templates
4. Initialize Git repository (optional)
5. Install dependencies (optional)
6. Display summary **Error Handling:**
- Automatic rollback on failure
- Step-by-step error recovery
- Detailed error messages ### 4. Prompts (`src/prompts/`) #### `questions.js` **Purpose:** Define interactive prompts for project configuration **Features:**
- Conditional questions based on project type
- Real-time validation with visual feedback
- Smart defaults based on context
- Multi-select and single-select options
- Custom validators and transformers **Question Categories:**
1. Project Type
2. Project Name (with validation)
3. Framework Selection (conditional)
4. Language Choice
5. Folder Structure
6. Styling Solution
7. Additional Libraries (multi-select)
8. Development Tools (multi-select)
9. Package Manager
10. Git Initialization ### 5. Utilities (`src/utils/`) #### `validation.js` **Purpose:** Input validation and sanitization **Functions:**
- `validateProjectName()` - Validate against npm rules
- `checkDirectoryExists()` - Check for conflicts
- `sanitizeProjectName()` - Fix common issues
- `suggestProjectName()` - Provide alternatives
- `validateAllInputs()` - Batch validation **Validation Rules:**
- npm package naming conventions
- No spaces or special characters
- Lowercase only
- Length limits
- Directory existence checks #### `errorHandler.js` **Purpose:** Centralized error handling and recovery **Features:**
- Custom `CLIError` class with error codes
- Formatted error display with suggestions
- Automatic project rollback on failure
- Graceful shutdown handlers (SIGINT, SIGTERM)
- Context-aware error messages **Error Codes:**
```javascript
{ VALIDATION_ERROR, DIRECTORY_EXISTS, CREATION_FAILED, INSTALL_FAILED, GIT_INIT_FAILED, PERMISSION_DENIED, NETWORK_ERROR, UNKNOWN_ERROR
}
``` #### `templateGenerator.js` **Purpose:** Generate project files from templates **Responsibilities:**
- Create folder structure
- Generate configuration files
- Copy template files
- Populate package.json
- Apply user preferences #### `packageManager.js` **Purpose:** Handle package manager operations **Features:**
- Support for npm, yarn, and pnpm
- Verbose mode for debugging
- Error recovery with manual instructions #### `git.js` **Purpose:** Git repository initialization **Features:**
- Initialize repository
- Create .gitignore
- Initial commit
- Graceful failure handling ## Data Flow ### Interactive Mode ```
┌─────────────┐
│ User │
└──────┬──────┘ │ ▼
┌─────────────────────┐
│ CLI Entry (cli.js) │
│ - Display banner │
│ - Parse args │
└──────┬──────────────┘ │ ▼
┌────────────────────────┐
│ Questions (questions.js)│
│ - Project type │
│ - Project name │
│ - Framework │
│ - Configuration │
└──────┬─────────────────┘ │ ▼
┌────────────────────────┐
│ Validation │
│ - validateProjectName │
│ - checkDirectoryExists │
└──────┬─────────────────┘ │ ▼
┌────────────────────────┐
│ Create Command │
│ - Create directory │
│ - Generate files │
│ - Init Git │
│ - Install deps │
└──────┬─────────────────┘ │ ▼
┌────────────────────────┐
│ Success / Error │
│ - Display summary │
│ - Show next steps │
│ - Or rollback on error │
└────────────────────────┘
``` ### Non-Interactive Mode (--yes) ```
┌─────────────┐
│ User │
│ --yes flag │
└──────┬──────┘ │ ▼
┌─────────────────────┐
│ CLI Entry (cli.js) │
│ - Use defaults │
│ - Skip prompts │
└──────┬──────────────┘ │ ▼
┌────────────────────────┐
│ Create Command │
│ (same flow as above) │
└────────────────────────┘
```

## 📦 Module Responsibilities ### CLI Layer (`cli.js`)
- Command registration
- Option parsing
- User interface (banner, help)
- Top-level orchestration
- Business logic
- File operations
- Validation logic ### Command Layer (`commands/`)
- Execute workflows
- Coordinate utilities
- Handle errors
- Display progress
- User input collection
- Direct file manipulation ### Prompt Layer (`prompts/`)
- Define questions
- Collect user input
- Basic validation
- Project creation
- File operations
- Complex business logic ### Utility Layer (`utils/`)
- Reusable functions
- Input validation
- File operations
- Error handling
- User interaction
- CLI-specific logic

## 🚨 Error Handling Strategy ### 1. Error Types **CLIError:** Custom error with code and context
```javascript
throw new CLIError( 'Message', ERROR_CODE, { details }
);
``` **System Errors:** File system, network, etc.
- Caught and wrapped in CLIError
- Provides user-friendly messages ### 2. Error Flow ```
┌─────────────────┐
│ Error Occurs │
└────────┬────────┘ │ ▼
┌─────────────────┐
│ Is CLIError? │
└────┬────────┬───┘ │ Yes │ No │ │ │ ▼ │ ┌────────────────┐ │ │ Wrap in │ │ │ CLIError │ │ └────────┬───────┘ │ │ ▼ ▼
┌─────────────────────┐
│ Rollback if needed │
│ - Remove directory │
│ - Clean up files │
└────────┬────────────┘ │ ▼
┌─────────────────────┐
│ Display Error │
│ - Formatted message │
│ - Error code │
│ - Suggestions │
└─────────────────────┘
``` ### 3. Rollback Mechanism Automatic cleanup on failure:
1. Detect error during creation
2. Stop ongoing operations
3. Remove created directory
4. Display cleanup message
5. Exit with error code ### 4. Graceful Shutdown Handle user interruption (Ctrl+C):
1. Catch SIGINT/SIGTERM
2. Rollback incomplete project
3. Display cleanup message
4. Exit cleanly

## 🔌 Extension Points ### Adding New Commands ```javascript
// In src/cli.js
program .command('new-command') .description('Description') .action(async () => { // Implementation });
``` ### Adding New Questions ```javascript
// In src/prompts/questions.js
{ type: 'list|input|checkbox|confirm', name: 'questionName', message: 'Question text', choices: [...], when: (answers) => condition, validate: (input) => validation,
}
``` ### Adding New Validators ```javascript
// In src/utils/validation.js
export function validateCustomInput(input) { // Validation logic return { valid: boolean, errors: [] };
}
``` ### Adding New Templates ```javascript
// In src/utils/templateGenerator.js
async function generateCustomTemplate(projectPath, config) { // Template generation logic
}
``` ### Adding New Error Types ```javascript
// In src/utils/errorHandler.js
export const ERROR_CODES = { ...existing, NEW_ERROR_CODE: 'NEW_ERROR_CODE',
};
``` ## Best Practices ### 1. Error Messages
- Be specific and actionable
- Provide suggestions
- Show error codes for debugging
- Include context

### 2. User Feedback
- Show progress with spinners
- Use colors meaningfully
- Display summaries
- Confirm actions ### 3. Validation
- Validate early
- Provide real-time feedback
- Suggest corrections
- Explain requirements ### 4. Code Organization
- One file = one responsibility
- Keep functions small and focused
- Use descriptive names
- Document complex logic ### 5. Testing
- Unit test utilities
- Integration test commands
- Mock external dependencies
- Test error scenarios --- **Next Steps:**
- [API Reference](./api-reference.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [User Guide](./user-guide.md)