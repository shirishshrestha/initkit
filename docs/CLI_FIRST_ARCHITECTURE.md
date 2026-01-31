# InitKit CLI-First Architecture Documentation

## Overview

InitKit has been refactored to use a **CLI-First** approach, delegating project creation to official framework CLIs and focusing on adding custom folder structures and developer experience enhancements.

## Architecture

### Core Philosophy

> **Let official framework CLIs do what they do best, and focus InitKit on what adds unique value - custom folder structures and project organization.**

### New Workflow

```
User Input → Official Framework CLI → Install Add-ons → Custom Folders → Git Init → Complete
```

#### Step-by-Step Process

1. **Bootstrap with Official CLI**
   - Next.js: `create-next-app`
   - React: Vite with `create-vite`
   - Vue: `create-vue`
   - NestJS: `@nestjs/cli`
   - etc.

2. **Install Add-ons via Official Methods**
   - shadcn/ui: `npx shadcn@latest init`
   - Prisma: `npx prisma init`
   - Playwright: `npm init playwright@latest`
   - Other libraries: Official install commands

3. **Enhance with Custom Folders**
   - Feature-based structure
   - Component-based structure
   - Clean architecture
   - MVC for backend

4. **Install All Dependencies**
   - Run package manager install command
   - Installs framework + add-ons + custom dependencies

5. **Initialize Git** (optional)
   - Create repository
   - Initial commit

## Module Structure

### `/src/utils/cliRunner.js`

**Purpose**: Execute external CLI commands with proper error handling

**Key Functions**:

- `execCommand(command, options)` - Run command with streaming output
- `execCommandWithOutput(command, options)` - Capture output
- `commandExists(command)` - Check if command is available

**Example**:

```javascript
await execCommand('npx create-next-app@latest my-app --typescript', {
  cwd: parentDirectory,
});
```

### `/src/utils/frameworkBootstrap.js`

**Purpose**: Bootstrap projects using official framework CLIs

**Supported Frameworks**:

| Framework | CLI Used            | Function             |
| --------- | ------------------- | -------------------- |
| Next.js   | `create-next-app`   | `bootstrapNextjs()`  |
| React     | `create-vite`       | `bootstrapReact()`   |
| Vue       | `create-vue`        | `bootstrapVue()`     |
| Nuxt      | `nuxi`              | `bootstrapNuxt()`    |
| Svelte    | `create-svelte`     | `bootstrapSvelte()`  |
| Express   | `express-generator` | `bootstrapExpress()` |
| NestJS    | `@nestjs/cli`       | `bootstrapNestJS()`  |
| Fastify   | `create-fastify`    | `bootstrapFastify()` |

**Example**:

```javascript
await bootstrapNextjs('/path/to/project', {
  language: 'typescript',
  styling: 'tailwind',
  packageManager: 'pnpm',
});
```

### `/src/utils/addonInstaller.js`

**Purpose**: Install additional libraries using official installation methods

**Categories**:

#### State Management

- **Redux Toolkit**: `npm install @reduxjs/toolkit react-redux`
- **Zustand**: `npm install zustand`
- **Jotai**: `npm install jotai`
- **Recoil**: `npm install recoil`

#### UI Libraries

- **shadcn/ui**: `npx shadcn@latest init` ⚡ (Has CLI!)
- **Material-UI**: `npm install @mui/material @emotion/react @emotion/styled`
- **Chakra UI**: `npm install @chakra-ui/react @emotion/react`
- **Ant Design**: `npm install antd`
- **Mantine**: `npm install @mantine/core @mantine/hooks`

#### ORM/Database

- **Prisma**: `npx prisma init` ⚡ (Has CLI!)
- **Drizzle**: `npm install drizzle-orm && npm install -D drizzle-kit`
- **TypeORM**: `npm install typeorm reflect-metadata`
- **Mongoose**: `npm install mongoose`

#### Authentication

- **NextAuth.js**: `npm install next-auth`
- **Clerk**: `npm install @clerk/nextjs`
- **Supabase**: `npm install @supabase/supabase-js`
- **Auth0**: `npm install @auth0/nextjs-auth0`

#### Testing

- **Playwright**: `npm init playwright@latest` ⚡ (Has CLI!)
- **Vitest**: `npm install -D vitest`
- **Jest**: `npm install -D jest @types/jest`
- **Cypress**: `npm install -D cypress`

**Example**:

```javascript
await installAddons('/path/to/project', {
  stateManagement: 'redux-toolkit',
  uiLibrary: 'shadcn',
  orm: 'prisma',
  database: 'postgresql',
  testing: ['vitest', 'playwright'],
});
```

### `/src/utils/templateGenerator.js`

**Purpose**: Add custom folder structures on top of CLI-generated projects

**Refactored Approach**:

- **Before**: Created all files from scratch
- **After**: Enhances existing CLI-generated projects

**Folder Structures**:

#### Frontend

- **Feature-based**: Organize by features (`auth/`, `dashboard/`, `users/`)
- **Component-based**: Organize by component types (`components/`, `pages/`, `hooks/`)
- **Atomic Design**: Atoms, molecules, organisms, templates

#### Backend

- **MVC**: Model-View-Controller pattern
- **Clean Architecture**: Domain-driven layers
- **Feature-based**: Module-based organization
- **Layered**: Controller-Service-Repository

**Example Structure (Feature-based)**:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── dashboard/
│   └── users/
└── shared/
    ├── components/
    ├── hooks/
    └── utils/
```

### `/src/commands/create.js`

**Purpose**: Orchestrate the entire project creation workflow

**Updated Workflow**:

```javascript
async function createProject(answers, options) {
  // 1. Bootstrap with official CLI
  await bootstrapWithOfficialCLI(projectPath, answers);

  // 2. Install add-ons
  if (hasAddons(answers)) {
    await installAddons(projectPath, answers);
  }

  // 3. Add custom folder structure
  await generateTemplate(projectPath, answers);

  // 4. Install dependencies
  await execCommand(getInstallCommand(packageManager), { cwd: projectPath });

  // 5. Initialize Git
  if (answers.useGit) {
    await initGit(projectPath);
  }

  // Success!
  displaySuccessMessage(answers, projectPath);
}
```

### `/src/prompts/questions.js`

**Purpose**: Collect user preferences for project configuration

**New Questions Added**:

- State management selection
- UI component library
- ORM/database tool
- Authentication solution
- Testing frameworks (multi-select)

**Conditional Logic**:

- Questions adapt based on project type (frontend/backend/fullstack)
- Database question shows only when ORM is selected
- Framework-specific options

## Benefits of CLI-First Approach

### 1. **Always Up-to-Date** 🚀

- Official CLIs handle updates automatically
- No need to track framework changes
- Latest best practices built-in

### 2. **Reduced Maintenance** 🔧

- 70-80% less template code
- Only manage folder structure additions
- Official CLIs handle edge cases

### 3. **Better Quality** ✨

- Official optimizations (build configs, tree-shaking)
- Framework-specific best practices
- Battle-tested configurations

### 4. **Proper Library Setup** 📦

- Libraries with CLIs run their setup wizards
- Automatic config file generation
- Optimal defaults from maintainers

### 5. **Smaller Package Size** 📉

- Removed all manual file templates
- Simpler, cleaner codebase
- Faster installation

### 6. **More Reliable** 🛡️

- Official CLIs tested by framework maintainers
- Better error messages
- Proper dependency resolution

## What InitKit Still Handles

InitKit's **unique value proposition**:

1. **Unified Interactive Experience** - One CLI for all choices
2. **Intelligent Folder Structures** - Battle-tested architectures
3. **Monorepo Setup** - Full-stack project configuration
4. **Docker Configuration** - Multi-stage builds, docker-compose
5. **CI/CD Templates** - GitHub Actions, GitLab CI
6. **API Integration** - Full-stack communication setup
7. **Environment Files** - .env templates with documentation
8. **Sample Files** - Placeholder components in folders
9. **Project Documentation** - README with setup instructions

## Usage Examples

### Creating a Next.js Project with Add-ons

```bash
npx initkit my-app

? Project type: Frontend
? Framework: Next.js
? Language: TypeScript
? Folder structure: Feature-based
? State management: Redux Toolkit
? UI library: shadcn/ui
? Authentication: Clerk
? Testing: Vitest, Playwright

✓ Bootstrapping with create-next-app...
✓ Installing Redux Toolkit...
✓ Setting up shadcn/ui...
✓ Installing Clerk...
✓ Installing Vitest...
✓ Installing Playwright...
✓ Creating feature-based folders...
✓ Installing dependencies...
✓ Git initialized
```

**Generated Project**:

```
my-app/
├── src/
│   ├── app/              # Next.js App Router (from create-next-app)
│   ├── features/         # Custom folder structure
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── users/
│   ├── shared/           # Shared components
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── store/            # Redux store (from add-on)
│   └── lib/
├── tests/
│   ├── e2e/              # Playwright tests
│   └── unit/             # Vitest tests
├── components.json       # shadcn config
├── .env.example
└── package.json
```

### Creating a Backend API with Prisma

```bash
npx initkit api-server

? Project type: Backend
? Framework: Express
? Language: TypeScript
? Architecture: Clean Architecture
? ORM: Prisma
? Database: PostgreSQL
? Authentication: None

✓ Bootstrapping with express-generator...
✓ Installing Prisma...
✓ Initializing Prisma with PostgreSQL...
✓ Creating clean architecture folders...
✓ Installing dependencies...
```

## Migration Guide

### For Existing InitKit Projects

If you have projects created with the old InitKit:

1. **No Breaking Changes** - Old projects continue to work
2. **New Projects Use CLI-First** - All new projects use official CLIs
3. **Manual Migration** - Optional, can recreate with new approach

### For Contributors

When adding new frameworks:

1. Find the official CLI command
2. Add bootstrap function in `frameworkBootstrap.js`
3. Add folder structure in `templateGenerator.js`
4. Update questions in `questions.js`
5. Test with real project creation

## Testing

### Unit Tests

Test individual modules:

```bash
npm test src/utils/cliRunner.test.js
npm test src/utils/addonInstaller.test.js
```

### Integration Tests

Test full workflow:

```bash
npm test __tests__/integration/projectGeneration.test.js
```

### Manual Testing

Create real projects:

```bash
node bin/index.js test-project
# Follow prompts and verify output
```

## Troubleshooting

### Issue: CLI Commands Hang

**Problem**: Command execution appears stuck

**Solution**:

- Check if CLI is waiting for interactive input
- Add non-interactive flags (`--yes`, `--skip-install`)
- Use `--skip-install` and install dependencies later

### Issue: Package Manager Mismatch

**Problem**: Wrong package manager used

**Solution**:

- Verify `--use-<manager>` flag is correct
- Check if CLI supports the package manager
- Fallback to npm if unsupported

### Issue: Add-on Installation Fails

**Problem**: Library installation errors

**Solution**:

- Check if library name is correct
- Verify CLI exists for libraries with CLIs
- Install dependencies first before running CLIs

## Performance Metrics

### Before CLI-First

- **Template code**: ~2500 lines
- **File generation**: 50-100 files
- **Creation time**: 15-30 seconds
- **Maintenance**: High (track all changes)

### After CLI-First

- **Template code**: ~800 lines (-70%)
- **File generation**: 10-20 files
- **Creation time**: 20-40 seconds
- **Maintenance**: Low (CLIs handle updates)

## Future Enhancements

1. **More Frameworks**
   - Angular with Angular CLI
   - SvelteKit
   - Remix
   - Astro

2. **Advanced Features**
   - Workspace templates for monorepos
   - Custom template repositories
   - Plugin system for extensions

3. **Better DX**
   - Preview folder structure before creation
   - Interactive folder customization
   - Template marketplace

## Conclusion

The CLI-First approach transforms InitKit from a "project creator" to a "project orchestrator" that:

✅ Leverages official framework CLIs for base setup
✅ Installs libraries using their official methods  
✅ Adds custom folder structures as unique value
✅ Requires minimal maintenance
✅ Provides reliable, up-to-date projects

This makes InitKit more sustainable, reliable, and focused on what it does best: helping developers organize their projects with industry-standard architectures.

---

**Version**: 1.1.0 (CLI-First)  
**Last Updated**: January 31, 2026  
**Maintainer**: InitKit Team
