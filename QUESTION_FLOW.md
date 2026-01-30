# InitKit Question Flow Design

## Complete User Prompt Flow

```
┌─────────────────────────────────────────┐
│   START: InitKit CLI                    │
│   $ initkit [project-name] [options]    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Q1: Project Name                         │
│ Type: input                              │
│ Validation: npm package name rules       │
│ Skip if: provided as CLI argument        │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Q2: Project Type                         │
│ Type: list                               │
│ Options:                                 │
│   • Frontend Only                        │
│   • Backend Only                         │
│   • Full Stack                           │
│   • Node.js Library/Package              │
└──────────────┬───────────────────────────┘
               │
       ┌───────┴────────┬────────────┬───────────┐
       ▼                ▼            ▼           ▼
   Frontend         Backend      Full Stack   Library
       │                │            │           │
       │                │            │           ▼
       │                │            │      ┌─────────────┐
       │                │            │      │ Skip to Q6  │
       │                │            │      │ (TypeScript)│
       │                │            │      └─────────────┘
       │                │            │
       ▼                ▼            ▼
┌──────────────────────────────────────────┐
│ Q3: Frontend Framework                   │
│ Type: list                               │
│ When: projectType === 'frontend' ||      │
│       projectType === 'fullstack'        │
│ Options:                                 │
│   • React                                │
│   • Vue.js                               │
│   • Angular                              │
│   • Svelte                               │
│   • Next.js (React)                      │
│   • Nuxt.js (Vue)                        │
│   • Vanilla JavaScript                   │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Q4: Backend Framework                    │
│ Type: list                               │
│ When: projectType === 'backend' ||       │
│       projectType === 'fullstack'        │
│ Options:                                 │
│   • Express.js                           │
│   • Fastify                              │
│   • Koa                                  │
│   • NestJS                               │
│   • Hapi                                 │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Q5: Database                             │
│ Type: list                               │
│ When: projectType === 'backend' ||       │
│       projectType === 'fullstack'        │
│ Options:                                 │
│   • PostgreSQL                           │
│   • MySQL                                │
│   • MongoDB                              │
│   • SQLite                               │
│   • None                                 │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Q6: TypeScript                           │
│ Type: confirm                            │
│ Default: true                            │
│ When: always                             │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Q7: Styling Solution                     │
│ Type: list                               │
│ When: projectType === 'frontend' ||      │
│       projectType === 'fullstack'        │
│ Options:                                 │
│   • Tailwind CSS                         │
│   • CSS Modules                          │
│   • Styled Components                    │
│   • Sass/SCSS                            │
│   • Plain CSS                            │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Q8: Additional Features                  │
│ Type: checkbox (multi-select)            │
│ When: always                             │
│ Options:                                 │
│   ☑ ESLint (Code linting)                │
│   ☑ Prettier (Code formatting)           │
│   ☐ Husky (Git hooks)                    │
│   ☐ Jest (Testing)                       │
│   ☐ Docker configuration                 │
│   ☐ GitHub Actions CI/CD                 │
│   ☑ Environment variables (.env)         │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Q9: Package Manager                      │
│ Type: list                               │
│ Default: npm                             │
│ When: always                             │
│ Options:                                 │
│   • npm                                  │
│   • yarn                                 │
│   • pnpm                                 │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Q10: Initialize Git                      │
│ Type: confirm                            │
│ Default: true                            │
│ When: always                             │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   PROCESSING                             │
│   • Create directory structure           │
│   • Generate files from templates        │
│   • Install dependencies                 │
│   • Initialize Git repository            │
│   • Show success message                 │
└──────────────┬───────────────────────────┘
               │
               ▼
         ┌─────────┐
         │   END   │
         └─────────┘
```

## Detailed Path Examples

### Path 1: Frontend React Project

```
Project Name: "my-react-app"
  ↓
Project Type: "Frontend Only"
  ↓
Frontend Framework: "React"
  ↓
[Skip Backend & Database]
  ↓
TypeScript: Yes
  ↓
Styling: "Tailwind CSS"
  ↓
Features: [ESLint, Prettier, Jest]
  ↓
Package Manager: "npm"
  ↓
Git: Yes
  ↓
RESULT: React + TypeScript + Tailwind project
```

### Path 2: Full Stack MERN Project

```
Project Name: "mern-app"
  ↓
Project Type: "Full Stack"
  ↓
Frontend Framework: "React"
  ↓
Backend Framework: "Express.js"
  ↓
Database: "MongoDB"
  ↓
TypeScript: Yes
  ↓
Styling: "CSS Modules"
  ↓
Features: [ESLint, Prettier, Docker, Jest]
  ↓
Package Manager: "pnpm"
  ↓
Git: Yes
  ↓
RESULT: Full stack MERN with TypeScript
        client/ (React) + server/ (Express)
```

### Path 3: Backend API Only

```
Project Name: "api-service"
  ↓
Project Type: "Backend Only"
  ↓
[Skip Frontend]
  ↓
Backend Framework: "Fastify"
  ↓
Database: "PostgreSQL"
  ↓
TypeScript: Yes
  ↓
[Skip Styling]
  ↓
Features: [ESLint, Prettier, Jest, Docker]
  ↓
Package Manager: "yarn"
  ↓
Git: Yes
  ↓
RESULT: Fastify API with PostgreSQL
```

### Path 4: Node.js Library

```
Project Name: "my-awesome-lib"
  ↓
Project Type: "Node.js Library/Package"
  ↓
[Skip Frontend, Backend, Database, Styling]
  ↓
TypeScript: Yes
  ↓
Features: [ESLint, Prettier, Jest]
  ↓
Package Manager: "npm"
  ↓
Git: Yes
  ↓
RESULT: Published npm package structure
        with build configuration
```

## Conditional Logic Rules

| Question      | Condition                    | Action       |
| ------------- | ---------------------------- | ------------ |
| Q3 (Frontend) | `projectType === 'backend'`  | Skip         |
| Q3 (Frontend) | `projectType === 'library'`  | Skip         |
| Q4 (Backend)  | `projectType === 'frontend'` | Skip         |
| Q4 (Backend)  | `projectType === 'library'`  | Skip         |
| Q5 (Database) | `projectType === 'frontend'` | Skip         |
| Q5 (Database) | `projectType === 'library'`  | Skip         |
| Q7 (Styling)  | `projectType === 'backend'`  | Skip         |
| Q7 (Styling)  | `projectType === 'library'`  | Skip         |
| All Questions | `--yes` flag present         | Use defaults |

## CLI Flags Override

```bash
# Skip all prompts
initkit my-app --yes

# Force TypeScript
initkit my-app --typescript

# Skip Git initialization
initkit my-app --no-git

# Use specific template
initkit my-app --template react
```

## Validation Rules

### Project Name (Q1)

- Must be valid npm package name
- Lowercase only
- No spaces (use hyphens)
- Can't start with . or \_
- Max 214 characters
- No uppercase letters

### All Questions

- Required fields cannot be empty
- Invalid choices trigger re-prompt
- Default values provided where sensible

## User Experience Flow

1. **Welcome Message**: Colorful ASCII art or branded message
2. **Progressive Disclosure**: Only show relevant questions
3. **Visual Feedback**: Spinners during file operations
4. **Clear Success Messages**: Show next steps
5. **Error Handling**: Graceful failures with helpful messages
6. **Exit Points**: Allow Ctrl+C at any time

## Template Generation Logic

```javascript
if (projectType === 'fullstack') {
  createDirectory('client/');
  createDirectory('server/');
  generateFrontend('client/', answers);
  generateBackend('server/', answers);
} else if (projectType === 'frontend') {
  generateFrontend('src/', answers);
} else if (projectType === 'backend') {
  generateBackend('src/', answers);
} else if (projectType === 'library') {
  generateLibrary('src/', answers);
}

if (answers.features.includes('docker')) {
  generateDockerfile(answers);
}

if (answers.features.includes('github-actions')) {
  generateGitHubWorkflow(answers);
}
```
