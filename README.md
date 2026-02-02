<div align="center">

# InitKit

**A modern CLI tool for scaffolding production-ready web projects**

[![npm version](https://img.shields.io/npm/v/initkit.svg)](https://www.npmjs.com/package/initkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)
[![Test Coverage](https://img.shields.io/badge/coverage-44%25-yellow.svg)](https://github.com/shirishshrestha/initkit)

Built with ES Modules | TypeScript Ready | Zero Config Required | Fully Documented

[Getting Started](#quick-start) • [Documentation](#documentation) • [Features](#features) • [Examples](#usage-examples)

</div>

---

## Demo

<div align="center">

![InitKit Demo](https://github.com/shirishshrestha/initkit/tree/main/assests)

_Creating a production-ready application with InitKit_

</div>

---

## Why InitKit?

InitKit eliminates the tedious project setup process by providing intelligent scaffolding with modern best practices. Whether you're building a frontend app, backend API, or full-stack application, InitKit generates a production-ready structure in seconds.

**Key Benefits:**

- **CLI-First Architecture** - Uses official framework CLIs (create-next-app, create-vite, create-vue, express-generator)
- **Smart Validation** - Real-time npm package name validation with helpful suggestions and colored feedback
- **Enhanced CLI UX** - Beautiful formatted help text with colors, boxes, and comprehensive examples
- **Always Up-to-Date** - Leverages official CLIs to ensure latest best practices and configurations
- **Non-Interactive Mode** - Properly configured for CI/CD with no hanging prompts
- **Flexible Architecture** - Feature-based, type-based, domain-driven, clean architecture structures
- **Docker Ready** - Complete Docker orchestration with multi-stage builds and docker-compose
- **API Integration** - Seamless frontend-backend communication with axios interceptors
- **Production Ready** - ESLint, Prettier, Git hooks, and CI/CD pipelines out of the box
- **Automatic Rollback** - Failed installations clean up automatically with transaction-like safety
- **Interactive Prompts** - Intelligent 13-question flow that adapts to your project type
- **4 Package Managers** - Full support for npm, yarn, pnpm, and bun
- **Fully Documented** - Comprehensive JSDoc comments, guides, and architecture documentation
- **Test Coverage** - 44% coverage with unit and integration tests included

---

## Quick Start

### Installation

```bash
npm install -g initkit
```

### Create Your First Project

```bash
# Interactive mode with step-by-step prompts
initkit

# Quick start with project name
initkit my-awesome-app

# Skip all prompts and use sensible defaults
initkit my-app --yes
```

---

## Documentation

Comprehensive documentation to help you get the most out of InitKit:

| Document                                                       | Description                                                            | Lines         |
| -------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------- |
| **[Quick Start Guide](./docs/QUICK_START.md)**                 | Get started in under 5 minutes with step-by-step tutorial              | ~350 lines    |
| **[Advanced Configuration](./docs/ADVANCED_CONFIGURATION.md)** | Custom templates, Docker, CI/CD, monorepo, and advanced features       | ~930 lines    |
| **[Architecture](./docs/ARCHITECTURE.md)**                     | System design, data flow, component architecture, and design decisions | ~800 lines    |
| **[Contributing Guide](./CONTRIBUTING.md)**                    | Code of conduct, workflow, code guidelines, and template creation      | ~500 lines    |
| **[Question Flow](./QUESTION_FLOW.md)**                        | Interactive 13-question flow and decision tree visualization           | Complete flow |
| **[Documentation Summary](./docs/DOCUMENTATION_SUMMARY.md)**   | Overview of all documentation and maintenance guide                    | ~670 lines    |

### 🚀 Getting Started

New to InitKit? Start here:

1. **[Quick Start Guide](./docs/QUICK_START.md)** - Create your first project in 5 minutes
2. **[Question Flow](./QUESTION_FLOW.md)** - Understand the interactive setup process
3. **[Advanced Configuration](./docs/ADVANCED_CONFIGURATION.md)** - Customize and extend InitKit

### 🛠️ For Contributors

Want to contribute or add a custom template?

1. **[Contributing Guide](./CONTRIBUTING.md)** - Code of conduct, workflow, guidelines
2. **[Architecture](./docs/ARCHITECTURE.md)** - Technical design and implementation
3. **[Examples](./docs/examples.md)** - Real-world examples to learn from

---

## Features

### 🎯 Project Types

| Type                | Description              | Use Case                         |
| ------------------- | ------------------------ | -------------------------------- |
| **Frontend Only**   | Single-page applications | React, Vue, Next.js apps         |
| **Backend Only**    | REST APIs and services   | Express, NestJS, Fastify servers |
| **Node.js Library** | Publishable npm packages | Reusable modules and utilities   |

### 🎨 Framework Support

**Frontend Frameworks:**

- React + Vite (Fast HMR, modern build tool)
- Next.js (App Router with TypeScript)
- Vue.js + Vite (Progressive framework)

**Backend Frameworks:**

- Express.js (Minimalist & flexible)

**Coming Soon:**

- NestJS (Enterprise TypeScript) - Code ready, testing in progress
- Fastify (High performance) - Code ready, testing in progress
- Nuxt.js (Vue 3) - Code ready, testing in progress
- Svelte (Modern reactivity) - Code ready, testing in progress

**Databases:**

- PostgreSQL (with connection pooling)
- MySQL (with TypeORM/Prisma)
- MongoDB (with Mongoose)
- SQLite (for prototyping)

### 🛠 Development Tools

**Code Quality:**

- ESLint (with recommended rules)
- Prettier (opinionated formatting)
- Husky (Git hooks)
- Lint-staged (pre-commit linting)
- EditorConfig (consistent coding styles)

**Testing:**

- Jest (comprehensive testing framework)
- Vitest (blazing fast unit tests)
- Pre-configured test structure

**DevOps:**

- Docker (multi-stage builds)
- Docker Compose (full-stack orchestration)
- GitHub Actions (CI/CD pipelines)
- Environment variables (.env setup)
- Turborepo (monorepo build system)

### Styling Solutions

| Solution              | Description                     | Best For                       |
| --------------------- | ------------------------------- | ------------------------------ |
| **Tailwind CSS**      | Utility-first CSS framework     | Rapid prototyping, modern apps |
| **CSS Modules**       | Scoped CSS with local scope     | Component isolation            |
| **Styled Components** | CSS-in-JS with tagged templates | React apps, dynamic styling    |
| **Emotion**           | Performant CSS-in-JS            | High-performance apps          |
| **Sass/SCSS**         | CSS preprocessor                | Complex stylesheets            |
| **Plain CSS**         | Standard CSS files              | Simple projects, full control  |

### 📦 Additional Libraries

**Frontend State Management:**

- Redux Toolkit (Industry-standard state management)
- Zustand (Lightweight state management)
- Jotai (Atomic state management)

**Frontend Routing & Data:**

- React Router (Client-side routing)
- TanStack Query (Data fetching & caching)
- React Hook Form (Performant forms)

**Frontend UI & Animation:**

- Radix UI (Headless UI components)
- React Icons (Popular icon library)
- ShadCN UI (Beautiful component library)
- Framer Motion (Smooth animations)

**Backend:**

- Prisma (Type-safe ORM)
- JWT (Secure authentication)
- Bcrypt (Password hashing)
- Winston (Structured logging)

**Common:**

- Axios (HTTP client)
- Lodash (Utility functions)
- Date-fns (Date manipulation)
- Zod (Schema validation)

### 📁 Folder Structure Options

| Structure         | Organization             | Best For                    |
| ----------------- | ------------------------ | --------------------------- |
| **Feature-based** | Group by feature/module  | Scalable applications       |
| **Type-based**    | Group by file type       | Small to medium projects    |
| **Domain-driven** | Group by business domain | Enterprise applications     |
| **Flat**          | Minimal nesting          | Simple projects, prototypes |

### 📝 Code Quality & Documentation

**InitKit Generated Projects Include:**

- **JSDoc Comments** - Comprehensive function documentation with examples
- **README.md** - Project-specific getting started guide
- **Code Standards** - ESLint rules enforcing best practices
- **Git Hooks** - Pre-commit linting with Husky and lint-staged
- **CI/CD Templates** - GitHub Actions workflows for testing and deployment
- **Environment Examples** - `.env.example` files with all required variables

**InitKit Codebase Quality:**

- **200+ JSDoc Blocks** - All functions fully documented with types and examples
- **44% Test Coverage** - Unit and integration tests with Jest
- **Comprehensive Docs** - 2,400+ lines of guides and architecture documentation
- **Modern Patterns** - ES Modules, async/await, error boundaries
- **Type Safety** - TypeScript-first with strict type checking

---

## Command Line Interface

### Enhanced CLI Experience

InitKit features a beautiful, user-friendly CLI with:

- **Colored Output** - Syntax highlighting and visual feedback
- **Formatted Boxes** - Clean, organized information display
- **Real-time Validation** - Instant feedback with ✓/✗ icons as you type
- **Smart Suggestions** - Auto-corrections for common mistakes
- **Progress Indicators** - Elegant spinners during operations
- **Helpful Examples** - Context-aware usage examples in help text

### Commands

```bash
# Create a new project (default command)
initkit [project-name] [options]

# List available templates and frameworks (categorized with icons)
initkit list

# Display CLI information and version (formatted with features list)
initkit info

# Show help (with examples and documentation links)
initkit --help
```

### Options

| Option                     | Alias  | Description                            | Default            |
| -------------------------- | ------ | -------------------------------------- | ------------------ |
| `--version`                | `-v`   | Output the current version             | -                  |
| `--template <name>`        | `-t`   | Specify template (react, vue, express) | Interactive prompt |
| `--yes`                    | `-y`   | Skip prompts, use defaults             | false              |
| `--typescript`             | `--ts` | Use TypeScript                         | true               |
| `--javascript`             | `--js` | Use JavaScript instead                 | false              |
| `--no-git`                 | -      | Skip Git initialization                | false              |
| `--no-install`             | -      | Skip dependency installation           | false              |
| `--package-manager <name>` | `-p`   | Use npm, yarn, pnpm, or bun            | npm                |
| `--verbose`                | -      | Show detailed output                   | false              |
| `--help`                   | `-h`   | Display help information               | -                  |

---

## Usage Examples

### Example 1: React + TypeScript + Tailwind

```bash
initkit my-react-app
# Select: Frontend Only → React → TypeScript → Tailwind CSS → ESLint + Prettier
```

**Generated Structure:**

```
my-react-app/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .eslintrc.cjs
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
└── package.json
```

### Example 2: Next.js with TypeScript

```bash
initkit nextjs-app
# Select: Frontend Only → Next.js → TypeScript → Tailwind CSS
```

**Generated Structure:**

```
nextjs-app/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   ├── features/
│   └── lib/
├── public/
├── .eslintrc.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

### Example 3: Vue with TypeScript

```bash
initkit vue-app
# Select: Frontend Only → Vue → TypeScript → Tailwind CSS
```

**Generated Structure:**

```
vue-app/
├── src/
│   ├── components/
│   ├── features/
│   ├── composables/
│   ├── stores/
│   ├── router/
│   ├── App.vue
│   └── main.ts
├── public/
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Example 4: Express Backend API

```bash
initkit api-server
# Select: Backend Only → Express → JavaScript → MVC structure
```

**Generated Structure:**

```
api-server/
├── models/
├── controllers/
├── routes/
│   ├── index.js
│   └── users.js
├── middlewares/
├── services/
├── .env.example
├── app.js
└── package.json
```

### Example 5: Quick Start with Defaults

```bash
initkit quick-app --yes
# Creates a React + Vite app with TypeScript + Tailwind CSS
```

---

## Interactive Prompt Flow

InitKit uses an intelligent question flow that adapts based on your project type:

1. **Project Type** - Frontend, Backend, or Library
2. **Project Name** - With real-time validation and suggestions
3. **Frontend Framework** - Shown for Frontend projects
4. **Backend Framework** - Shown for Backend projects
5. **Database/ORM** - Shown for Backend projects
6. **Language** - TypeScript (recommended) or JavaScript
7. **Folder Structure** - Feature-based, Type-based, Domain-driven, or Flat
8. **TypeScript Strictness** - Strict, Moderate, or Relaxed (if TS selected)
9. **Styling Solution** - CSS frameworks and preprocessors
10. **Additional Libraries** - Multi-select from curated list
11. **Development Features** - Testing, linting, Docker, CI/CD
12. **Package Manager** - npm, yarn, or pnpm
13. **Git Initialization** - Initialize repository with .gitignore

See [QUESTION_FLOW.md](./QUESTION_FLOW.md) for the complete decision tree.

---

## What Makes InitKit Special?

### 🎯 Production-Ready Output

Unlike other scaffolding tools, InitKit generates **truly production-ready** projects:

- **Official CLIs** - Uses create-next-app, create-vite, create-vue, express-generator for best practices
- **Always Current** - Leverages framework maintainers' latest configurations
- **No Hanging** - Properly configured non-interactive mode for CI/CD pipelines
- **TypeScript First** - Full TypeScript support with proper configurations
- **Best Practices Built-in** - ESLint, Prettier, proper folder structures
- **Package Manager Choice** - Full support for npm, yarn, pnpm, and bun

### 🚀 Developer Experience

- **Intelligent Prompts** - Context-aware questions that adapt to your choices
- **Real-time Feedback** - See validation results as you type
- **Helpful Errors** - Clear messages with suggestions for fixing issues
- **Automatic Cleanup** - Failed installations roll back completely
- **Comprehensive Docs** - 2,400+ lines of guides, tutorials, and API docs

### 🏗️ Enterprise-Grade Architecture

- **Clean Code** - Feature-based, domain-driven, or type-based organization
- **Scalable Structure** - Monorepo support with Turborepo for large projects
- **Type Safety** - Full TypeScript support with strict type checking
- **Testing Ready** - Jest/Vitest configured with example tests
- **Maintainable** - Consistent patterns, JSDoc comments, clear separation of concerns

### 📚 Documentation Excellence

**For Users:**

- Quick Start Guide (5-minute tutorial)
- Advanced Configuration (Docker, CI/CD, monorepo)
- Interactive Question Flow visualization

**For Developers:**

- Architecture Documentation (800+ lines)
- Contributing Guide with template creation walkthrough
- Comprehensive JSDoc on all functions

**For Code:**

- Generated README for every project
- Environment variable documentation
- API integration examples

---

## Development

### Setup

```bash
# Clone the repository
git clone git@github.com:shirishshrestha/initkit.git
cd initkit

# Install dependencies
npm install

# Link for local development
npm link
```

### Available Scripts

```bash
# Run the CLI locally
npm start [project-name]

# Run tests with ES modules support
npm test

# Lint code
npm run lint

# Format code
npm run format

# Pre-publish checks (test + lint)
npm run prepublishOnly
```

### Project Structure

```
initkit/
├── bin/
│   └── index.js              # CLI entry point
├── src/
│   ├── cli.js                # Main CLI program
│   ├── index.js              # Programmatic API
│   ├── commands/
│   │   └── create.js         # Project creation logic
│   ├── prompts/
│   │   └── questions.js      # Interactive prompts
│   └── utils/
│       ├── errorHandler.js   # Error handling & rollback
│       ├── validation.js     # Input validation
│       ├── templateGenerator.js
│       ├── packageManager.js
│       └── git.js
├── templates/                # Project templates (to be added)
├── docs/                     # Documentation
├── __tests__/               # Test files
└── package.json
```

---

## Technical Details

### Built With

**Core Dependencies:**

- **Commander.js** (12.0.0) - CLI framework with command routing
- **Inquirer** (9.2.15) - Interactive prompts with validation
- **Chalk** (5.3.0) - Terminal styling and colors
- **Ora** (8.0.1) - Elegant progress spinners
- **fs-extra** (11.2.0) - Enhanced file system operations
- **validate-npm-package-name** (5.0.0) - Package name validation

**Development Dependencies:**

- **Jest** (29.7.0) - Testing framework with ES module support
- **ESLint** (9.17.0) - Code linting with modern rules
- **Prettier** (3.4.2) - Code formatting

### ES Modules Architecture

InitKit is built entirely with modern ES Modules:

- ✅ `"type": "module"` in package.json
- ✅ All imports use `.js` file extensions
- ✅ Native ESM support (no transpilation)
- ✅ Compatible with Node.js 14+
- ✅ Tree-shakeable for optimal bundle sizes

### Error Handling System

**Professional-Grade Error Management:**

- **CLIError Class** - Custom error type with codes and context
- **8 Error Codes** - Specific error types (VALIDATION_ERROR, DIRECTORY_EXISTS, etc.)
- **Automatic Rollback** - Transaction-like cleanup on failure
- **Graceful Shutdown** - Handles Ctrl+C and other interrupts
- **Validation Errors** - Clear messages with helpful suggestions
- **Safe File Operations** - All I/O wrapped in error boundaries
- **Context Preservation** - Errors include relevant debugging information

---

## Requirements

- **Node.js**: >= 14.0.0
- **Package Manager**: npm >= 6.0.0 (or yarn >= 1.22.0, pnpm >= 6.0.0, bun >= 1.0.0)
- **Git**: >= 2.0.0 (for Git initialization feature)
- **TypeScript**: Automatically installed per project (no global installation needed)

---

## Troubleshooting

### Common Issues

#### 1. TypeScript Config Errors

**Problem:** `No inputs were found in config file` error after project generation.

**Solution:** This has been fixed in the latest version. Update InitKit:

```bash
npm update -g initkit
```

If you're on an older version, manually update your `tsconfig.json`:

```json
{
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

#### 2. Package Installation Fails

**Problem:** Dependencies fail to install during project creation.

**Solutions:**

- Check your internet connection
- Try a different package manager: `initkit my-app --package-manager pnpm`
- Clear npm cache: `npm cache clean --force`
- Use `--no-install` flag and install manually later:
  ```bash
  initkit my-app --no-install
  cd my-app
  npm install
  ```

#### 3. Directory Already Exists

**Problem:** `DIRECTORY_EXISTS` error when creating a project.

**Solution:** Choose a different project name or remove the existing directory:

```bash
rm -rf my-app  # On Unix/Mac
rmdir /s my-app  # On Windows
```

#### 4. Permission Denied Errors

**Problem:** `EACCES` or permission errors during installation.

**Solutions:**

- On Unix/Mac: Use sudo (not recommended) or fix npm permissions:
  ```bash
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  export PATH=~/.npm-global/bin:$PATH
  ```
- On Windows: Run terminal as Administrator
- Or install locally without `-g` flag

#### 5. Backend Feature-Based Structure Errors

**Problem:** `ENOENT: no such file or directory` when creating backend with feature-based structure.

**Solution:** This has been fixed. Update InitKit to the latest version:

```bash
npm update -g initkit
```

#### 6. Git Initialization Fails

**Problem:** Git repository not initialized or .gitignore missing.

**Solutions:**

- Ensure Git is installed: `git --version`
- Manually initialize: `git init && git add . && git commit -m "Initial commit"`
- Use `--no-git` flag if Git is not available

#### 7. Outdated Package Versions

**Problem:** Generated projects have old package versions.

**Solution:** InitKit now fetches latest versions from npm automatically. Update to latest:

```bash
npm update -g initkit
```

For existing projects, update packages:

```bash
npm update  # Update to latest within semver range
npm outdated  # Check for newer versions
```

### Getting Help

If you encounter issues not listed here:

1. **Check existing issues**: [GitHub Issues](https://github.com/shirishshrestha/initkit/issues)
2. **Create a new issue**: Include:
   - InitKit version: `initkit --version`
   - Node version: `node --version`
   - OS: Windows/Mac/Linux
   - Full error message
   - Steps to reproduce
3. **Join discussions**: [GitHub Discussions](https://github.com/shirishshrestha/initkit/discussions)

### Debug Mode

Run InitKit with verbose output for debugging:

```bash
initkit my-app --verbose
```

---

## Recent Updates

### Version 1.2.0 (Latest) 🚀

**🎉 BREAKING CHANGES:**

- **Removed fullstack project type** - Simplified to focus on stable frontend and backend options
- **Migrated to CLI-first architecture** - Now uses official framework CLIs exclusively

**✨ Major Features:**

- **CLI-First Architecture** - Uses official CLIs for all frameworks:
  - `create-next-app` for Next.js projects
  - `create-vite@5.1.0` for React (pinned for stability)
  - `create-vue` with `--typescript --default` for Vue
  - `express-generator` for Express backends
- **Enhanced Logging** - Emoji-based progress indicators (📦) with detailed command visibility
- **Non-Interactive Mode** - All frameworks properly configured for CI/CD (no hanging prompts)

**🐛 Bug Fixes:**

- Fixed package manager override bug (CLI default removed)
- Fixed create-vite@8.x hanging (pinned to stable v5.1.0)
- Fixed create-vue prompting (added --default flag)
- Fixed CI environment variable for non-interactive execution

**🔧 Improvements:**

- Always uses latest framework configurations from official CLIs
- Better error messages and rollback handling
- Cleaner codebase with removed legacy template files
- All tests passing (48/48)

**📊 Test Results:**

- React + Vite: ✅ 16.5s (218 packages)
- Next.js: ✅ 26.9s (347 packages)
- Vue: ✅ 16.2s (153 packages)
- Express: ✅ 12.3s (53 packages)

---

## Recent Updates

### Version 1.2.2 (January 2026)

**Critical Bug Fixes:**

- ✅ **Fixed Tailwind CSS installation** - Resolved issue where styling was not installed if no other addons were selected
- ✅ **Fixed package manager compatibility** - All 4 package managers (npm, yarn, pnpm, bun) now work correctly with Tailwind CSS
- ✅ **Fixed Next.js duplicate configs** - Prevents duplicate Tailwind config files in Next.js projects
- ✅ **Improved file creation** - Uses proper fs-extra methods for reliable config file generation

**What's Fixed:**

- `hasAddons()` function now properly checks for styling configuration
- Changed from unreliable `npx tailwindcss init` to direct config file creation
- All package managers tested and verified working
- Next.js now uses built-in Tailwind setup (no duplicates)

**Testing:**

- ✅ 4/4 package managers passing tests (npm, yarn, pnpm, bun)
- ✅ Verified across React+Vite, Next.js, and Vue.js
- ✅ No duplicate configuration files

[View Full Changelog](./docs/CHANGELOG.md)

---

## Contributing

We welcome contributions! InitKit has comprehensive documentation to help you get started.

**📖 Read First:**

- [Contributing Guide](./CONTRIBUTING.md) - Code of conduct, workflow, and guidelines
- [Architecture Documentation](./docs/ARCHITECTURE.md) - System design and patterns
- [Adding Templates](./CONTRIBUTING.md#adding-new-templates) - 5-step guide for new frameworks

**Quick Start:**

1. Fork the repository
2. Clone and setup: `git clone <your-fork> && cd initkit && npm install`
3. Create feature branch: `git checkout -b feature/amazing-feature`
4. Make changes and add tests (maintain 40%+ coverage)
5. Commit with conventional commits: `git commit -m 'feat: add amazing feature'`
6. Push and create PR: `git push origin feature/amazing-feature`

**Contribution Areas:**

- 🎨 Add new framework templates (React, Vue, Next.js, etc.)
- 🐛 Fix bugs and improve error messages
- 📝 Improve documentation and examples
- ✅ Add more test coverage
- 🚀 Optimize performance and bundle size
- 💡 Suggest new features and improvements

**Code Standards:**

- Follow ESLint rules (run `npm run lint`)
- Add JSDoc comments to all functions
- Write tests for new features
- Update documentation as needed

---

## License

MIT © [Shirish Shrestha](https://github.com/shirishshrestha)

---

## Project Statistics

### Codebase Metrics

- **Total Lines of Code**: ~4,000+ lines
- **Documentation**: 2,400+ lines across 6 major docs
- **JSDoc Comments**: 200+ function documentation blocks
- **Test Coverage**: 44% (unit + integration tests)
- **Test Files**: 7 test suites with 52 passing tests
- **Supported Frameworks**: 15+ (Frontend, Backend, Full-Stack)
- **Template Files**: 10+ production-ready templates

### Documentation Coverage

- ✅ Quick Start Guide (5-minute tutorial)
- ✅ Advanced Configuration (930 lines)
- ✅ Architecture Documentation (800 lines)
- ✅ Contributing Guide (500 lines)
- ✅ Question Flow (complete decision tree)
- ✅ JSDoc on all major functions
- ✅ Enhanced CLI help with examples

---

## Support

- **Issues**: [GitHub Issues](https://github.com/shirishshrestha/initkit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/shirishshrestha/initkit/discussions)
- **Documentation**: [Full Documentation](./docs/QUICK_START.md)
- **Email**: shirish.shrestha07@gmail.com

---

<div align="center">

**Made with ❤️ by developers, for developers**

[⭐ Star on GitHub](https://github.com/shirishshrestha/initkit) | [📖 Documentation](./docs/user-guide.md) | [🐛 Report Bug](https://github.com/shirishshrestha/initkit/issues)

</div>
