# InitKit - Interactive Question Flow

> **Complete decision tree and prompt flow for the InitKit CLI (v1.1.0)**

This document outlines the 13-question interactive flow that adapts based on your project type. The CLI uses intelligent conditional logic to show only relevant questions.

**Latest Update (v1.1.0):** Live NPM version fetching, Redux Toolkit, Jotai, React Router, Radix UI, ShadCN UI, React Icons, and Bun package manager support.

---

## Flow Overview

```
START: $ initkit [project-name] [options]
         │
         ├─ Q1: Project Type (Frontend/Backend/Full Stack/Library)
         │      │
         │      ├─ Frontend/Full Stack → Q2: Frontend Framework
         │      ├─ Backend/Full Stack  → Q3: Backend Framework
         │      └─ Backend/Full Stack  → Q4: Database
         │
         ├─ Q5: Project Name (with real-time validation)
         ├─ Q6: Language (TypeScript/JavaScript)
         │      │
         │      └─ If TypeScript → Q7: TypeScript Strictness
         │
         ├─ Q8: Folder Structure (if Frontend/Full Stack)
         ├─ Q9: Styling Solution (if Frontend/Full Stack)
         ├─ Q10: Additional Libraries (context-aware)
         ├─ Q11: Development Features (ESLint, Prettier, etc.)
         ├─ Q12: Package Manager (npm/yarn/pnpm/bun)
         └─ Q13: Git Initialization
                 │
                 ▼
            PROCESSING
                 │
         ┌───────┴───────────────┐
         │ Success Flow          │
         │                       │
         │ 1. Fetch versions 🌐  │
         │ 2. Create directory   │
         │ 3. Generate files     │
         │ 4. Init git           │
         │ 5. Install deps       │
         │ 6. Success summary    │
         └───────────────────────┘
         
         Note: Step 1 queries npm registry
         for latest package versions
```

---

## Question Details

### Q1: Project Type
**Purpose:** Determines the entire flow and which subsequent questions to ask

```javascript
Type: list (single choice)
Message: "What type of project do you want to create?"
Always shown: Yes
Skip condition: None
```

**Options:**
- `Frontend Only` → Skip backend/database questions
- `Backend Only` → Skip frontend/styling questions
- `Full Stack` → Show all framework questions
- `Node.js Library/Package` → Skip frontend, backend, database, styling

**Default project names by type:**
- Frontend: `my-frontend-app`
- Backend: `my-backend-api`
- Full Stack: `my-fullstack-app`
- Library: `my-package`

---

### Q2: Frontend Framework
**Purpose:** Select the frontend technology stack

```javascript
Type: list
Message: "Choose your frontend framework:"
When: projectType === 'frontend' || projectType === 'fullstack'
```

**Options:**
| Framework | Value | Description |
|-----------|-------|-------------|
| React | `react` | Component-based UI library |
| Vue.js | `vue` | Progressive JavaScript framework |
| Angular | `angular` | Full-featured framework |
| Svelte | `svelte` | Compiled framework |
| Next.js (React) | `nextjs` | React framework with SSR |
| Nuxt.js (Vue) | `nuxtjs` | Vue framework with SSR |
| Vanilla JavaScript | `vanilla` | Plain ES6+ JavaScript |

---

### Q3: Backend Framework
**Purpose:** Select the backend/API framework

```javascript
Type: list
Message: "Choose your backend framework:"
When: projectType === 'backend' || projectType === 'fullstack'
```

**Options:**
| Framework | Value | Description |
|-----------|-------|-------------|
| Express.js | `express` | Minimalist & flexible |
| Fastify | `fastify` | High performance |
| Koa | `koa` | Next-gen Express |
| NestJS | `nestjs` | Enterprise TypeScript |
| Hapi | `hapi` | Configuration-centric |

---

### Q4: Database
**Purpose:** Select database system for data persistence

```javascript
Type: list
Message: "Choose your database:"
When: projectType === 'backend' || projectType === 'fullstack'
```

**Options:**
| Database | Value | Use Case |
|----------|-------|----------|
| PostgreSQL | `postgresql` | Relational, ACID compliant |
| MySQL | `mysql` | Popular relational DB |
| MongoDB | `mongodb` | NoSQL document store |
| SQLite | `sqlite` | Embedded, serverless |
| None | `none` | No database needed |

---

### Q5: Project Name
**Purpose:** Define the project directory name with validation

```javascript
Type: input
Message: "What is your project name?"
When: !initialProjectName (skip if provided as CLI arg)
Validation: npm package name rules
Real-time: Color feedback (green = valid, red = invalid)
```

**Validation Rules:**
- Lowercase only (no uppercase letters)
- No spaces (use hyphens instead)
- Cannot start with `.` or `_`
- Max 214 characters
- Valid URL-safe characters only
- Cannot use reserved npm package names

**Interactive Features:**
- Real-time color feedback as you type
- Automatic suggestion if invalid (e.g., "My App" → "my-app")
- Directory existence check
- Uses `validate-npm-package-name` library

**Example Validation Flow:**
```
Input: "My Cool App"
Error: "Name cannot contain spaces"
Suggestion: "my-cool-app"

Input: "my-cool-app"
Status: ✓ Valid (shown in green)
```

---

### Q6: Language
**Purpose:** Choose between TypeScript and JavaScript

```javascript
Type: list
Message: "Choose your programming language:"
Always shown: Yes
Default: 'typescript'
```

**Options:**
| Choice | Value | Recommendation |
|--------|-------|----------------|
| TypeScript (Recommended) | `typescript` | Type safety, better DX |
| JavaScript | `javascript` | Simpler, no compilation |

**Impact:**
- Affects file extensions (`.ts`/`.tsx` vs `.js`/`.jsx`)
- Generates `tsconfig.json` if TypeScript
- Installs type definitions (`@types/*`)
- Configures build tools accordingly

---

### Q7: TypeScript Strictness
**Purpose:** Configure TypeScript compiler strictness level

```javascript
Type: list
Message: "TypeScript strictness level:"
When: language === 'typescript'
Default: 'strict'
```

**Options:**
| Level | Value | Configuration |
|-------|-------|---------------|
| Strict (Recommended) | `strict` | All strict flags enabled |
| Moderate | `moderate` | Balanced type checking |
| Relaxed | `relaxed` | Minimal type checking |

**Generated `tsconfig.json` settings:**
```json
// Strict
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true
}

// Moderate
{
  "strict": false,
  "noImplicitAny": true,
  "strictNullChecks": false
}

// Relaxed
{
  "strict": false,
  "noImplicitAny": false
}
```

---

### Q8: Folder Structure
**Purpose:** Choose code organization pattern

```javascript
Type: list
Message: "Choose your folder structure preference:"
When: projectType === 'frontend' || projectType === 'fullstack'
Default: 'feature-based'
```

**Options:**

| Structure | Value | Organization | Best For |
|-----------|-------|--------------|----------|
| **Feature-based** | `feature-based` | Group by feature/module | Scalable apps |
| **Type-based** | `type-based` | Group by file type | Small-medium projects |
| **Domain-driven** | `domain-driven` | Group by business domain | Enterprise apps |
| **Flat** | `flat` | Minimal nesting | Prototypes, simple apps |

**Structure Examples:**

**Feature-based:**
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── auth.types.ts
│   ├── dashboard/
│   └── profile/
└── shared/
```

**Type-based:**
```
src/
├── components/
├── hooks/
├── services/
├── utils/
└── types/
```

**Domain-driven:**
```
src/
├── domains/
│   ├── user/
│   ├── product/
│   └── order/
└── infrastructure/
```

**Flat:**
```
src/
├── App.tsx
├── Header.tsx
├── Footer.tsx
└── utils.ts
```

---

### Q9: Styling Solution
**Purpose:** Select CSS framework or preprocessor

```javascript
Type: list
Message: "Choose your styling solution:"
When: projectType === 'frontend' || projectType === 'fullstack'
```

**Options:**
| Solution | Value | Description | Setup Complexity |
|----------|-------|-------------|------------------|
| Tailwind CSS | `tailwind` | Utility-first CSS | PostCSS config |
| CSS Modules | `css-modules` | Scoped CSS | Bundler config |
| Styled Components | `styled-components` | CSS-in-JS | Install package |
| Emotion | `emotion` | Performant CSS-in-JS | Install package |
| Sass/SCSS | `sass` | CSS preprocessor | Install sass |
| Plain CSS | `css` | Standard CSS files | None |

---

### Q10: Additional Libraries
**Purpose:** Select optional utility libraries

```javascript
Type: checkbox (multi-select)
Message: "Select additional libraries to include:"
Dynamic choices: Based on project type
```

**Common Libraries (All Projects):**
- `Axios` - HTTP client for API calls
- `Lodash` - Utility function library
- `Date-fns` - Date manipulation
- `Zod` - Schema validation

**Frontend-Specific Libraries:**

*State Management:*
- `Redux Toolkit` - Industry-standard state management with React Redux
- `Zustand` - Lightweight state management
- `Jotai` - Atomic state management

*Routing & Data:*
- `React Router` - Client-side routing
- `TanStack Query` - Data fetching & caching
- `React Hook Form` - Performant form handling

*UI & Animation:*
- `Radix UI` - Headless accessible components
- `ShadCN UI` - Beautiful component library
- `React Icons` - Popular icon library
- `Framer Motion` - Animation library

**Backend-Specific Libraries:**
- `Prisma` - Type-safe ORM
- `JWT` - Token-based authentication
- `Bcrypt` - Password hashing
- `Winston` - Structured logging

**Conditional Logic:**
```javascript
if (projectType === 'frontend' || projectType === 'fullstack') {
  choices = [...commonChoices, ...frontendChoices]
}
if (projectType === 'backend' || projectType === 'fullstack') {
  choices = [...commonChoices, ...backendChoices]
}
```

---

### Q11: Development Features
**Purpose:** Select development tools and configurations

```javascript
Type: checkbox (multi-select)
Message: "Select development tools and features:"
Always shown: Yes
Pre-checked: ESLint, Prettier, dotenv, EditorConfig
```

**Options:**
| Feature | Value | Pre-checked | Description |
|---------|-------|-------------|-------------|
| ESLint | `eslint` | ✓ Yes | Code linting |
| Prettier | `prettier` | ✓ Yes | Code formatting |
| Husky | `husky` | No | Git hooks |
| Lint-staged | `lint-staged` | No | Pre-commit linting |
| Jest | `jest` | No | Unit testing |
| Vitest | `vitest` | No | Fast unit testing |
| Docker | `docker` | No | Containerization |
| GitHub Actions | `github-actions` | No | CI/CD pipelines |
| .env support | `dotenv` | ✓ Yes | Environment variables |
| EditorConfig | `editorconfig` | ✓ Yes | Editor consistency |

**Generated Files by Feature:**
- `eslint` → `.eslintrc.cjs`, `.eslintignore`
- `prettier` → `.prettierrc`, `.prettierignore`
- `husky` → `.husky/pre-commit`
- `jest` → `jest.config.js`, `__tests__/`
- `docker` → `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- `github-actions` → `.github/workflows/ci.yml`
- `dotenv` → `.env.example`, `.env`
- `editorconfig` → `.editorconfig`

---

### Q12: Package Manager
**Purpose:** Choose which package manager to use

```javascript
Type: list
Message: "Choose your package manager:"
Always shown: Yes
Default: 'npm'
```

**Options:**
| Manager | Value | Install Command | Run Script | Speed |
|---------|-------|----------------|------------|-------|
| npm | `npm` | `npm install` | `npm run dev` | Standard |
| yarn | `yarn` | `yarn install` | `yarn dev` | Fast |
| pnpm | `pnpm` | `pnpm install` | `pnpm dev` | Very Fast |
| bun | `bun` | `bun install` | `bun run dev` | Blazing Fast ⚡ |

**Impact:**
- Lock file type (package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb)
- Installation speed and disk usage (bun is fastest)
- Workspaces configuration (if monorepo)
- CI/CD pipeline commands
- Runtime compatibility (bun can also run scripts)

---

### Q13: Git Initialization
**Purpose:** Initialize Git repository with .gitignore

```javascript
Type: confirm (yes/no)
Message: "Initialize Git repository?"
Always shown: Yes
Default: true
```

**If Yes:**
- Runs `git init`
- Creates `.gitignore` with common patterns
- Makes initial commit (optional)

**Generated `.gitignore` includes:**
```
node_modules/
dist/
build/
.env
.env.local
*.log
.DS_Store
coverage/
```

---

## Conditional Logic Matrix

| Question | Frontend | Backend | Full Stack | Library |
|----------|----------|---------|------------|---------|
| Q1: Project Type | ✓ | ✓ | ✓ | ✓ |
| Q2: Frontend Framework | ✓ | ✗ | ✓ | ✗ |
| Q3: Backend Framework | ✗ | ✓ | ✓ | ✗ |
| Q4: Database | ✗ | ✓ | ✓ | ✗ |
| Q5: Project Name | ✓ | ✓ | ✓ | ✓ |
| Q6: Language | ✓ | ✓ | ✓ | ✓ |
| Q7: TS Strictness | If TS | If TS | If TS | If TS |
| Q8: Folder Structure | ✓ | ✗ | ✓ | ✗ |
| Q9: Styling | ✓ | ✗ | ✓ | ✗ |
| Q10: Libraries | ✓ | ✓ | ✓ | ✓ |
| Q11: Features | ✓ | ✓ | ✓ | ✓ |
| Q12: Package Manager | ✓ | ✓ | ✓ | ✓ |
| Q13: Git | ✓ | ✓ | ✓ | ✓ |

---

## Complete Flow Examples


## Version Fetching (New in v1.1.0)

InitKit now fetches **actual latest versions** from the npm registry:

```bash
⠹ Fetching latest package versions...
✔ Fetched latest versions

Results:
- React: ^19.2.4 (not "latest" string)
- Vite: ^7.3.1
- Next.js: ^16.1.11
- TypeScript: ^5.9.3
- Redux Toolkit: ^2.11.2
- Tailwind CSS: ^4.1.18
```

**How it works:**
1. Queries `registry.npmjs.org/${package}/latest` via HTTPS
2. Parses JSON response for version number
3. Returns in `^x.y.z` semver format
4. Falls back to safe defaults if network fails
5. Shows spinner during fetch with success/error feedback

**Benefits:**
- Always get the latest stable versions
- Professional package.json (no "latest" strings)
- No manual version updates needed
- Fallback ensures reliability

---

## Complete Flow Examples

### Example 1: React + TypeScript + Tailwind (Frontend)

**User Journey:**
```
$ initkit my-react-app

Q1: Project Type → "Frontend Only"
Q2: Frontend Framework → "React"
Q3: Project Name → "my-react-app" ✓ valid
Q4: Language → "TypeScript"
Q5: TS Strictness → "Strict"
Q6: Folder Structure → "Feature-based"
Q7: Styling → "Tailwind CSS"
Q8: Libraries → [Redux Toolkit, TanStack Query, Radix UI]
Q9: Features → [ESLint, Prettier, Jest, EditorConfig, dotenv]
Q10: Package Manager → "npm"
Q11: Git → "Yes"

⏳ Creating project...
⠹ Fetching latest package versions...
✔ Found React ^19.2.4, Vite ^7.3.1, Redux Toolkit ^2.11.2
✓ Project structure created
✓ Files generated
✓ Git initialized
✓ Dependencies installed (npm)
✨ Success!
```

**Generated Structure:**
```
my-react-app/
├── src/
│   ├── features/
│   │   └── example/
│   ├── shared/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .eslintrc.cjs
├── .prettierrc
├── .editorconfig
├── .env.example
├── .gitignore
├── jest.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json

Dependencies (with actual latest versions):
- react ^19.2.4, react-dom ^19.2.4
- @reduxjs/toolkit ^2.11.2, react-redux ^9.2.0
- @tanstack/react-query ^6.10.3
- @radix-ui/react-* (multiple packages)
- vite ^7.3.1
- tailwindcss ^4.1.18, postcss, autoprefixer
- typescript ^5.9.3, @types/react
- eslint, prettier, jest
```

---

### Example 2: Express API + PostgreSQL (Backend)

**User Journey:**
```
$ initkit api-service

Q1: Project Type → "Backend Only"
Q2: Backend Framework → "Express.js"
Q3: Database → "PostgreSQL"
Q4: Project Name → "api-service" ✓ valid
Q5: Language → "TypeScript"
Q6: TS Strictness → "Moderate"
Q7: Libraries → [Prisma, JWT, Bcrypt, Winston]
Q8: Features → [ESLint, Prettier, Docker, GitHub Actions, dotenv]
Q9: Package Manager → "pnpm"
Q10: Git → "Yes"

⏳ Creating project...
✓ Project structure created
✓ Docker configuration added
✓ CI/CD pipeline configured
✓ Git initialized
✓ Dependencies installed
✨ Success!
```

**Generated Structure:**
```
api-service/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   └── app.ts
├── prisma/
│   └── schema.prisma
├── .github/
│   └── workflows/
│       └── ci.yml
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── .gitignore
├── tsconfig.json
└── package.json

Dependencies:
- express, @types/express
- @prisma/client, prisma
- jsonwebtoken, bcrypt
- winston
- typescript
- eslint, prettier
```

---

### Example 3: Full Stack MERN (Next.js + Express)

**User Journey:**
```
$ initkit mern-app

Q1: Project Type → "Full Stack"
Q2: Frontend Framework → "Next.js (React)"
Q3: Backend Framework → "Express.js"
Q4: Database → "MongoDB"
Q5: Project Name → "mern-app" ✓ valid
Q6: Language → "TypeScript"
Q7: TS Strictness → "Strict"
Q8: Folder Structure → "Type-based"
Q9: Styling → "CSS Modules"
Q10: Libraries → [Axios, React Query, Zod]
Q11: Features → [ESLint, Prettier, Husky, Jest, Docker, dotenv]
Q12: Package Manager → "yarn"
Q13: Git → "Yes"

⏳ Creating project...
✓ Monorepo structure created
✓ Client (Next.js) configured
✓ Server (Express) configured
✓ Docker setup complete
✓ Git initialized with Husky
✓ Dependencies installed
✨ Success!
```

**Generated Structure:**
```
mern-app/
├── client/                    # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── styles/
│   ├── next.config.js
│   ├── tsconfig.json
│   └── package.json
├── server/                    # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── app.ts
│   ├── tsconfig.json
│   └── package.json
├── .github/
│   └── workflows/
├── .husky/
│   └── pre-commit
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .eslintrc.cjs
├── .prettierrc
└── package.json               # Root package.json for workspaces

Workspace Dependencies:
Client:
- next, react, react-dom
- axios, @tanstack/react-query
- zod

Server:
- express, @types/express
- mongoose, @types/mongoose
- zod
```

---

### Example 4: Node.js Library/Package

**User Journey:**
```
$ initkit my-utility-lib

Q1: Project Type → "Node.js Library/Package"
Q2: Project Name → "my-utility-lib" ✓ valid
Q3: Language → "TypeScript"
Q4: TS Strictness → "Strict"
Q5: Libraries → [Lodash, Date-fns]
Q6: Features → [ESLint, Prettier, Jest, GitHub Actions, EditorConfig]
Q7: Package Manager → "npm"
Q8: Git → "Yes"

⏳ Creating project...
✓ Library structure created
✓ Build configuration added
✓ Test setup complete
✓ Git initialized
✓ Dependencies installed
✨ Success!
```

**Generated Structure:**
```
my-utility-lib/
├── src/
│   ├── index.ts
│   └── utils.ts
├── dist/                      # Build output
├── __tests__/
│   └── index.test.ts
├── .github/
│   └── workflows/
│       └── publish.yml
├── .eslintrc.cjs
├── .prettierrc
├── .editorconfig
├── .gitignore
├── .npmignore
├── jest.config.js
├── tsconfig.json
└── package.json

package.json extras:
- "main": "dist/index.js"
- "types": "dist/index.d.ts"
- "files": ["dist"]
- Build scripts configured
```

---

### Example 5: Quick Start with --yes Flag

**User Journey:**
```
$ initkit my-app --yes

Uses defaults:
- Project Type: Full Stack
- Frontend: React
- Backend: Express
- Database: None (can be added later)
- Language: TypeScript (strict)
- Folder Structure: Feature-based
- Styling: Tailwind CSS
- Features: [ESLint, Prettier, dotenv]
- Package Manager: npm
- Git: Yes

⏳ Creating project...
✓ All done in 45 seconds!
```

---

## CLI Flag Overrides

CLI flags can override or skip prompts:

```bash
# Skip ALL prompts
initkit my-app --yes

# Force TypeScript
initkit my-app --typescript

# Force JavaScript instead
initkit my-app --javascript

# Skip Git initialization
initkit my-app --no-git

# Skip dependency installation
initkit my-app --no-install

# Specify package manager
initkit my-app --package-manager pnpm

# Use specific template (skips framework prompts)
initkit my-app --template react

# Verbose output for debugging
initkit my-app --verbose

# Combine flags
initkit my-app --yes --javascript --no-git --package-manager yarn
```

**Flag Priority:**
1. CLI flags override prompt answers
2. If `--yes` is used, remaining flags can still override defaults
3. If `--template` is specified, it overrides framework selections

---

## Error Handling & Validation

### Project Name Validation

**Invalid Inputs & Suggestions:**
```
Input: "My Cool App"
❌ Error: Name cannot contain spaces
💡 Suggestion: my-cool-app

Input: "my_cool_app"
❌ Error: Name cannot contain underscores
💡 Suggestion: my-cool-app

Input: "MyCoolApp"
❌ Error: Name cannot contain uppercase
💡 Suggestion: my-cool-app

Input: "123app"
❌ Error: Name cannot start with a number
💡 Suggestion: app-123

Input: "react"
❌ Error: Name conflicts with popular package
💡 Suggestion: my-react-app
```

### Directory Existence Check

```
Input: "existing-folder"
❌ Error: Directory "existing-folder" already exists
   Please choose a different name.

Options:
1. Choose a different name
2. Delete existing directory manually
3. Use --force flag (not recommended)
```

### Interrupt Handling (Ctrl+C)

```
User presses Ctrl+C during:
- Prompts: Clean exit, no files created
- File generation: Rollback initiated
- Dependency installation: Cleanup partial files

Rollback Process:
1. Display: "Operation interrupted"
2. Remove created directory
3. Display: "Cleanup complete"
4. Exit with code 130
```

---

## Template Generation Logic

```javascript
// Pseudocode for template generation

if (projectType === 'fullstack') {
  createDirectory('client/');
  createDirectory('server/');
  
  generateFrontend('client/', {
    framework: answers.frontend,
    language: answers.language,
    styling: answers.styling,
    folderStructure: answers.folderStructure,
  });
  
  generateBackend('server/', {
    framework: answers.backend,
    database: answers.database,
    language: answers.language,
  });
  
  generateRootFiles({
    packageManager: answers.packageManager,
    workspaces: true,
  });
  
} else if (projectType === 'frontend') {
  generateFrontend('src/', answers);
  
} else if (projectType === 'backend') {
  generateBackend('src/', answers);
  
} else if (projectType === 'library') {
  generateLibrary('src/', {
    language: answers.language,
    buildTool: 'rollup',
  });
}

// Add optional features
if (answers.features.includes('docker')) {
  generateDockerfile(answers);
  generateDockerCompose(answers);
}

if (answers.features.includes('github-actions')) {
  generateGitHubWorkflow(answers);
}

if (answers.features.includes('husky')) {
  setupGitHooks(answers);
}

// Add selected libraries
installAdditionalLibraries(answers.additionalLibraries);

// Initialize Git if requested
if (answers.useGit) {
  await initGit(projectPath);
}

// Install dependencies
if (answers.installDependencies !== false) {
  await installDependencies(
    projectPath,
    answers.packageManager
  );
}
```

---

## Success Output & Next Steps

After successful project creation:

```
✨ Project created successfully!

Next steps:

  1. Navigate to your project:
     cd my-app

  2. Start development server:
     npm run dev

  3. Open your browser:
     http://localhost:3000 (frontend)
     http://localhost:5000 (backend)

Additional commands:

  npm run build       Build for production
  npm run test        Run tests
  npm run lint        Lint code
  npm run format      Format code

Documentation:

  README.md          Project overview
  CONTRIBUTING.md    How to contribute
  .env.example       Environment variables

Happy coding!
```

---

## Troubleshooting

### Common Issues

**Problem:** "Directory already exists"
```bash
Solution 1: Choose a different name
Solution 2: Remove the directory first
  rm -rf existing-folder
Solution 3: Navigate elsewhere
  cd ~/projects
```

**Problem:** "Invalid project name"
```bash
Check: Use lowercase letters and hyphens only
Example: my-project-name
Avoid: My Project Name, my_project_name
```

**Problem:** "npm install failed"
```bash
Causes:
- Network issues
- Registry timeout
- Disk space

Solutions:
1. Check internet connection
2. Clear npm cache: npm cache clean --force
3. Try different registry: npm config set registry https://registry.npmjs.org/
4. Free up disk space
```

**Problem:** "Git initialization failed"
```bash
Check: Git is installed
  git --version

Install Git:
- Windows: https://git-scm.com/download/win
- Mac: brew install git
- Linux: sudo apt install git
```

---

## Advanced Usage

### Programmatic API

You can use InitKit programmatically in your Node.js scripts:

```javascript
import { createProject } from 'initkit';

const answers = {
  projectName: 'my-app',
  projectType: 'frontend',
  frontend: 'react',
  language: 'typescript',
  styling: 'tailwind',
  features: ['eslint', 'prettier'],
  packageManager: 'npm',
  useGit: true,
};

await createProject(answers, {
  verbose: true,
  projectPath: '/path/to/project',
});
```

### Custom Templates (Coming Soon)

```bash
# Use custom template from GitHub
initkit my-app --template https://github.com/user/template

# Use local template
initkit my-app --template ./my-custom-template
```

---

## References

- [Main README](./README.md) - Project overview
- [User Guide](./docs/user-guide.md) - Detailed usage instructions
- [API Reference](./docs/api-reference.md) - Programmatic API
- [Architecture](./docs/architecture.md) - Technical design
- [Examples](./docs/examples.md) - Real-world examples

---

<div align="center">

**InitKit** - Built by developers, for developers

[GitHub](https://github.com/shirishshrestha/initkit) | [npm](https://www.npmjs.com/package/initkit) | [Issues](https://github.com/shirishshrestha/initkit/issues)

</div>
