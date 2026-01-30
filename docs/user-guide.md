# 📖 User Guide

> **User Documentation** | Complete guide to using InitKit CLI effectively

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Commands](#commands)
- [Options](#options)
- [Interactive Prompts](#interactive-prompts)
- [Troubleshooting](#troubleshooting)
- [Getting Help](#getting-help)

---

## 📦 Installation ### Global Installation (Recommended)
```bash
npm install -g initkit
``` ### Using npx (No Installation)
```bash
npx initkit create my-project
``` ### Local Installation
```bash
npm install initkit
npx initkit create my-project
```

## 🚀 Quick Start ### Interactive Mode (Recommended)
Start the CLI and follow the prompts:
```bash
initkit
```
or
```bash
initkit create
``` ### Quick Setup with Defaults
Create a project with default settings:
```bash
initkit create my-project --yes
``` ### Specify Project Name
```bash
initkit create my-awesome-app
```

## 💻 Commands ### `create [project-name]`
Create a new project (default command). **Usage:**
```bash
initkit create [project-name] [options]
# or simply
initkit [project-name] [options]
``` **Arguments:**
- `project-name` - Name of your project (optional, will prompt if not provided) **Options:**
- `-y, --yes` - Skip prompts and use defaults
- `--ts, --typescript` - Use TypeScript (default)
- `--js, --javascript` - Use JavaScript instead
- `-t, --template <name>` - Use a specific template
- `--no-git` - Skip Git initialization
- `--no-install` - Skip dependency installation
- `-p, --package-manager <manager>` - Choose package manager (npm/yarn/pnpm)
- `--verbose` - Show detailed output ### `list`
Display available templates and frameworks. **Usage:**
```bash
initkit list
``` ### `info`
Show information about InitKit CLI. **Usage:**
```bash
initkit info
``` ### `--version, -v`
Display the current version. **Usage:**
```bash
initkit --version
``` ### `--help, -h`
Display help information. **Usage:**
```bash
initkit --help
initkit create --help
```

## ⚙️ Options ### Project Type Options #### `-y, --yes`
Skip all prompts and create with default configuration. **Example:**
```bash
initkit create quick-app --yes
``` **Defaults:**
- Project Type: Full Stack
- Frontend: React
- Backend: Express
- Language: TypeScript
- Package Manager: npm
- Features: ESLint, Prettier, dotenv #### `-t, --template <template>`
Specify a project template. **Available Templates:**
- `react` - React frontend
- `vue` - Vue.js frontend
- `angular` - Angular frontend
- `svelte` - Svelte frontend
- `nextjs` - Next.js (React)
- `nuxtjs` - Nuxt.js (Vue)
- `express` - Express.js backend
- `fastify` - Fastify backend
- `nestjs` - NestJS backend **Example:**
```bash
initkit create my-app --template react
``` ### Language Options #### `--ts, --typescript`
Use TypeScript (enabled by default). **Example:**
```bash
initkit create my-app --typescript
``` #### `--js, --javascript`
Use JavaScript instead of TypeScript. **Example:**
```bash
initkit create my-app --javascript
``` ### Git Options #### `--no-git`
Skip Git repository initialization. **Example:**
```bash
initkit create my-app --no-git
``` ### Installation Options #### `--no-install`
Skip automatic dependency installation. **Example:**
```bash
initkit create my-app --no-install
``` #### `-p, --package-manager <manager>`
Specify package manager to use. **Options:** `npm`, `yarn`, `pnpm` **Example:**
```bash
initkit create my-app --package-manager pnpm
``` ### Output Options #### `--verbose`
Show detailed output during project creation. **Example:**
```bash
initkit create my-app --verbose
```

## 🎯 Interactive Prompts When running InitKit without the `--yes` flag, you'll be guided through an interactive setup: ### 1. Project Type
Choose the type of project:
- 🎨 **Frontend Only** - Client-side application
- **Backend Only** - Server/API application
- 🔥 **Full Stack** - Combined frontend and backend
- 📦 **Node.js Library/Package** - NPM package ### 2. Project Name
Enter a valid project name:
- Must be lowercase
- Can contain letters, numbers, hyphens, and underscores
- Cannot start with a dot or underscore
- Must be a valid npm package name
- Real-time validation with suggestions ### 3. Framework Selection **Frontend (if applicable):**
- React
- Vue.js
- Angular
- Svelte
- Next.js
- Nuxt.js
- Vanilla JavaScript **Backend (if applicable):**
- Express.js
- Fastify
- Koa
- NestJS
- Hapi ### 4. Database (Backend/Full Stack only)
- PostgreSQL
- MySQL
- MongoDB
- SQLite
- None ### 5. Language
- TypeScript (Recommended)
- JavaScript ### 6. TypeScript Strictness (if TypeScript selected)
- **Strict** - Recommended for new projects
- **Moderate** - Balanced type checking
- **Relaxed** - Minimal type checking ### 7. Folder Structure (Frontend/Full Stack only)
- **Feature-based** - Organize by feature/module
- **Type-based** - Organize by file type (components, utils, etc.)
- **Domain-driven** - Organize by business domain
- **Flat** - Simple, minimal structure ### 8. Styling Solution (Frontend/Full Stack only)
- Tailwind CSS
- CSS Modules
- Styled Components
- Emotion
- Sass/SCSS
- Plain CSS ### 9. Additional Libraries (Multi-select) **Common:**
- Axios (HTTP client)
- Lodash (Utility library)
- Date-fns (Date utility)
- Zod (Schema validation) **Frontend:**
- React Query (Data fetching)
- Zustand (State management)
- React Hook Form (Forms)
- Framer Motion (Animations) **Backend:**
- Prisma (ORM)
- JWT (Authentication)
- Bcrypt (Password hashing)
- Winston (Logging) ### 10. Development Tools (Multi-select)
- ESLint (Code linting) ✓
- Prettier (Code formatting) ✓
- Husky (Git hooks)
- Lint-staged
- Jest (Unit testing)
- Vitest (Fast unit testing)
- Docker configuration
- GitHub Actions CI/CD
- Environment variables (.env) ✓
- EditorConfig ✓ ### 11. Package Manager
- npm
- yarn
- pnpm ### 12. Git Initialization
- Initialize Git repository? (Yes/No) ## Examples ### Create a React App with TypeScript
```bash
initkit create my-react-app
# Select: Frontend Only → React → TypeScript
``` ### Create an Express API
```bash
initkit create my-api
# Select: Backend Only → Express.js → TypeScript
``` ### Full Stack MERN Application
```bash
initkit create mern-app
# Select: Full Stack → React → Express.js → MongoDB
``` ### Quick Next.js Project
```bash
initkit create next-app --template nextjs --yes
``` ### JavaScript Project with Yarn
```bash
initkit create js-project --javascript --package-manager yarn
``` ### Create Without Git or Install
```bash
initkit create my-project --no-git --no-install
``` ### Verbose Output for Debugging
```bash
initkit create my-app --verbose
``` ## Troubleshooting ### Project Name Validation Errors **Error:** "Project name must be lowercase"
```bash
# Bad
initkit create MyProject # Good
initkit create my-project
``` **Error:** "Project name cannot contain spaces"
```bash
# Bad
initkit create my awesome project # Good
initkit create my-awesome-project
``` ### Directory Already Exists **Error:** "Directory 'my-project' already exists" **Solution:**
1. Use a different name
2. Remove the existing directory
3. Or work in a different location ```bash
# Option 1: Different name
initkit create my-project-v2 # Option 2: Remove existing
rm -rf my-project
initkit create my-project
``` ### Installation Failures **Error:** "Failed to install dependencies" **Solutions:**
1. Check your internet connection
2. Install manually after creation: ```bash cd my-project npm install ```
3. Try a different package manager: ```bash initkit create my-project --package-manager yarn ``` ### Git Initialization Fails **Error:** "Git initialization failed" **Solutions:**
1. Ensure Git is installed: `git --version`
2. Skip Git initialization: `initkit create my-project --no-git`
3. Initialize manually later: ```bash cd my-project git init ``` ### Permission Denied Errors **Error:** "Permission denied" **Solutions:**
1. Run in a directory where you have write permissions
2. On Linux/Mac, avoid using sudo with npm
3. Change directory ownership: ```bash sudo chown -R $USER:$GROUP ~/.npm sudo chown -R $USER:$GROUP ~/.config ```

## 🆘 Getting Help ### View Available Commands
```bash
initkit --help
``` ### Get Help for Specific Command
```bash
initkit create --help
``` ### Check Version
```bash
initkit --version
``` ### Report Issues
If you encounter any bugs or have feature requests, please file an issue on GitHub. --- **Next Steps:**
- [CLI Architecture](./architecture.md)
- [API Reference](./api-reference.md)
- [Contributing Guide](../CONTRIBUTING.md)