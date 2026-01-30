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

## Why InitKit?

InitKit eliminates the tedious project setup process by providing intelligent scaffolding with modern best practices. Whether you're building a frontend app, backend API, or full-stack application, InitKit generates a production-ready structure in seconds.

**Key Benefits:**
- **Smart Validation** - Real-time npm package name validation with helpful suggestions and colored feedback
- **Enhanced CLI UX** - Beautiful formatted help text with colors, boxes, and comprehensive examples
- **Monorepo Support** - Full-stack monorepo architecture with Turborepo and shared packages
- **Multiple Stacks** - MERN, PERN, T3 Stack, Next.js + Express, and more
- **Flexible Architecture** - Feature-based, type-based, domain-driven, or flat structures
- **Docker Ready** - Complete Docker orchestration with multi-stage builds and docker-compose
- **API Integration** - Seamless frontend-backend communication with axios interceptors
- **Production Ready** - ESLint, Prettier, Git hooks, and CI/CD pipelines out of the box
- **Automatic Rollback** - Failed installations clean up automatically with transaction-like safety
- **Interactive Prompts** - Intelligent 13-question flow that adapts to your project type
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

| Document | Description | Lines |
|----------|-------------|-------|
| **[Quick Start Guide](./docs/QUICK_START.md)** | Get started in under 5 minutes with step-by-step tutorial | ~350 lines |
| **[Advanced Configuration](./docs/ADVANCED_CONFIGURATION.md)** | Custom templates, Docker, CI/CD, monorepo, and advanced features | ~930 lines |
| **[Architecture](./docs/ARCHITECTURE.md)** | System design, data flow, component architecture, and design decisions | ~800 lines |
| **[Contributing Guide](./CONTRIBUTING.md)** | Code of conduct, workflow, code guidelines, and template creation | ~500 lines |
| **[Question Flow](./QUESTION_FLOW.md)** | Interactive 13-question flow and decision tree visualization | Complete flow |
| **[Documentation Summary](./docs/DOCUMENTATION_SUMMARY.md)** | Overview of all documentation and maintenance guide | ~670 lines |

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

| Type | Description | Use Case |
|------|-------------|----------|
| **Frontend Only** | Single-page applications | React, Vue, Angular, Svelte apps |
| **Backend Only** | REST APIs and services | Express, Fastify, NestJS servers |
| **Full Stack** | Integrated client + server | Monorepo with frontend and backend |
| **Node.js Library** | Publishable npm packages | Reusable modules and utilities |

### 🎨 Framework Support

**Frontend Frameworks:**
- React (with Create React App or Vite)
- Vue.js (Vue CLI or Vite)
- Angular (Angular CLI)
- Svelte (SvelteKit)
- Next.js (App Router & Pages Router)
- Nuxt.js (Vue 3)
- Vanilla JavaScript (Modern ES6+)

**Backend Frameworks:**
- Express.js (Minimalist & flexible)
- Fastify (High performance)
- Koa (Next-gen Express)
- NestJS (Enterprise TypeScript)
- Hapi (Configuration-centric)

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

### 🏗️ Full-Stack Architectures

**Monorepo (Turborepo):**
- Shared packages (types, UI components)
- Unified workspace management
- Optimized build pipeline
- Consistent tooling across apps

**Traditional Stack Options:**
- **MERN** - MongoDB + Express + React + Node
- **PERN** - PostgreSQL + Express + React + Node  
- **Next.js + Express** - Full-stack React with API
- **Laravel + React** - PHP backend with React frontend

**Features:**
- API integration (Vite proxy, Next.js rewrites)
- Docker orchestration (frontend + backend + database)
- Environment configuration
- Shared TypeScript types
- Reusable UI components

### 🎨 Styling Solutions

| Solution | Description | Best For |
|----------|-------------|----------|
| **Tailwind CSS** | Utility-first CSS framework | Rapid prototyping, modern apps |
| **CSS Modules** | Scoped CSS with local scope | Component isolation |
| **Styled Components** | CSS-in-JS with tagged templates | React apps, dynamic styling |
| **Emotion** | Performant CSS-in-JS | High-performance apps |
| **Sass/SCSS** | CSS preprocessor | Complex stylesheets |
| **Plain CSS** | Standard CSS files | Simple projects, full control |

### 📦 Additional Libraries

**Frontend:**
- React Query (Data fetching & caching)
- Zustand (Lightweight state management)
- React Hook Form (Performant forms)
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

| Structure | Organization | Best For |
|-----------|-------------|----------|
| **Feature-based** | Group by feature/module | Scalable applications |
| **Type-based** | Group by file type | Small to medium projects |
| **Domain-driven** | Group by business domain | Enterprise applications |
| **Flat** | Minimal nesting | Simple projects, prototypes |

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

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--version` | `-v` | Output the current version | - |
| `--template <name>` | `-t` | Specify template (react, vue, express) | Interactive prompt |
| `--yes` | `-y` | Skip prompts, use defaults | false |
| `--typescript` | `--ts` | Use TypeScript | true |
| `--javascript` | `--js` | Use JavaScript instead | false |
| `--no-git` | - | Skip Git initialization | false |
| `--no-install` | - | Skip dependency installation | false |
| `--package-manager <name>` | `-p` | Use npm, yarn, or pnpm | npm |
| `--verbose` | - | Show detailed output | false |
| `--help` | `-h` | Display help information | - |

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

### Example 2: Full Stack MERN with Docker

```bash
initkit fullstack-app
# Select: Full Stack → Traditional → MERN
```

**Generated Structure:**
```
fullstack-app/
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── features/
│   │   ├── components/
│   │   └── lib/api.js
│   ├── Dockerfile
│   └── package.json
├── server/              # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml   # MongoDB + Frontend + Backend
└── README.md
```

### Example 3: Monorepo with Turborepo

```bash
initkit my-monorepo
# Select: Full Stack → Monorepo → Next.js + Express + PostgreSQL
```

**Generated Structure:**
```
my-monorepo/
├── apps/
│   ├── frontend/        # Next.js app
│   └── backend/         # Express API
├── packages/
│   ├── shared-types/    # Shared TypeScript interfaces
│   └── ui-components/   # Shared React components
├── turbo.json          # Turborepo config
├── docker-compose.yml
└── package.json
```

### Example 4: Express API with Docker

```bash
initkit api-server
# Select: Backend Only → Express → MongoDB → TypeScript → Docker + GitHub Actions
```

**Features:**
- RESTful API structure
- MongoDB connection setup
- Docker multi-stage build
- GitHub Actions CI/CD
- Environment variable management

### Example 5: Quick Start with Defaults

```bash
initkit quick-app --yes
# Creates a full-stack app with React + Express + TypeScript
```

---

## Interactive Prompt Flow

InitKit uses an intelligent 13-question flow that adapts based on your project type:

1. **Project Type** - Frontend, Backend, Full Stack, or Library
2. **Project Name** - With real-time validation and suggestions
3. **Frontend Framework** - Shown for Frontend/Full Stack projects
4. **Backend Framework** - Shown for Backend/Full Stack projects
5. **Database** - Shown for Backend/Full Stack projects
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

- **No Manual Setup Required** - Everything configured and ready to deploy
- **Best Practices Built-in** - Error boundaries, loading states, proper TypeScript types
- **Security First** - Environment variables, input validation, secure authentication patterns
- **Performance Optimized** - Code splitting, lazy loading, optimized bundle sizes
- **Deployment Ready** - Docker files, CI/CD pipelines, health checks included

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
- **npm**: >= 6.0.0 (or yarn >= 1.22.0, pnpm >= 6.0.0)
- **Git**: >= 2.0.0 (for Git initialization feature)

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
- **Email**: your.email@example.com

---

<div align="center">

**Made with ❤️ by developers, for developers**

[⭐ Star on GitHub](https://github.com/shirishshrestha/initkit) | [📖 Documentation](./docs/user-guide.md) | [🐛 Report Bug](https://github.com/shirishshrestha/initkit/issues)

</div>