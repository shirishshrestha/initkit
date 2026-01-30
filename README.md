<div align="center">

# InitKit

**A modern CLI tool for scaffolding production-ready web projects**

[![npm version](https://img.shields.io/npm/v/initkit.svg)](https://www.npmjs.com/package/initkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)

Built with ES Modules | TypeScript Ready | Zero Config Required

[Getting Started](#quick-start) • [Documentation](#documentation) • [Features](#features) • [Examples](#usage-examples)

</div>

---

## Why InitKit?

InitKit eliminates the tedious project setup process by providing intelligent scaffolding with modern best practices. Whether you're building a frontend app, backend API, or full-stack application, InitKit generates a production-ready structure in seconds.

**Key Benefits:**
- **Smart Validation** - Real-time npm package name validation with helpful suggestions
- **Monorepo Support** - Full-stack monorepo architecture with Turborepo
- **Multiple Stacks** - MERN, PERN, Next.js + Express, Laravel + React
- **Flexible Architecture** - Feature-based, type-based, domain-driven, or flat structures
- **Docker Ready** - Complete Docker orchestration for all services
- **API Integration** - Seamless frontend-backend communication setup
- **Production Ready** - ESLint, Prettier, Git hooks, and CI/CD out of the box
- **Automatic Rollback** - Failed installations clean up automatically
- **Interactive Prompts** - Customized workflow based on your project type

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

| Document | Description |
|----------|-------------|
| **[User Guide](./docs/user-guide.md)** | Complete usage guide with step-by-step instructions |
| **[API Reference](./docs/api-reference.md)** | Programmatic API for custom integrations |
| **[Architecture](./docs/architecture.md)** | Technical design and implementation details |
| **[Examples](./docs/examples.md)** | Real-world project examples and use cases |
| **[Question Flow](./QUESTION_FLOW.md)** | Interactive prompt flow and decision tree |
| **[Build Summary](./docs/BUILD_SUMMARY.md)** | Development history and implementation notes |

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

---

## Command Line Interface

### Commands

```bash
# Create a new project (default command)
initkit [project-name] [options]

# List available templates and frameworks
initkit list

# Display CLI information and version
initkit info

# Show help
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

- **Commander.js** (12.0.0) - CLI framework
- **Inquirer** (9.2.15) - Interactive prompts
- **Chalk** (5.3.0) - Terminal styling
- **Ora** (8.0.1) - Elegant spinners
- **fs-extra** (11.2.0) - Enhanced file operations
- **EJS** (3.1.9) - Template engine
- **validate-npm-package-name** (5.0.0) - Name validation

### ES Modules

InitKit is built entirely with ES Modules:
- `"type": "module"` in package.json
- All imports use `.js` file extensions
- `createRequire` for JSON imports
- Compatible with Node.js 14+

### Error Handling

- **8 Error Codes** - Specific error types for debugging
- **Automatic Rollback** - Cleans up on failure
- **Graceful Shutdown** - Handles Ctrl+C interruptions
- **Validation Errors** - Clear messages with suggestions

---

## Requirements

- **Node.js**: >= 14.0.0
- **npm**: >= 6.0.0 (or yarn >= 1.22.0, pnpm >= 6.0.0)
- **Git**: >= 2.0.0 (for Git initialization feature)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT © [Shirish Shrestha](https://github.com/shirishshrestha)

---

## Support

- **Issues**: [GitHub Issues](https://github.com/shirishshrestha/initkit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/shirishshrestha/initkit/discussions)
- **Email**: your.email@example.com

---

<div align="center">

**Made with ❤️ by developers, for developers**

[⭐ Star on GitHub](https://github.com/shirishshrestha/initkit) | [📖 Documentation](./docs/user-guide.md) | [🐛 Report Bug](https://github.com/shirishshrestha/initkit/issues)

</div>