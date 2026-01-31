# Changelog

All notable changes to InitKit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.2] - 2026-01-31

### Fixed

#### CRITICAL: hasAddons() Missing Styling Check
- **Root Cause**: `hasAddons()` function didn't check for `config.styling`
- **Impact**: Projects with ONLY styling solutions (Tailwind, Sass, etc.) would skip addon installation entirely
- **Symptoms**: 
  - User selects Tailwind CSS
  - Project creates "successfully"
  - But tailwind.config.js is missing
  - No styling packages installed
  - No error shown (silent failure)
- **Affected**: All users who selected styling without other addons
- **Fix**: Added styling check: `(config.styling && config.styling !== 'none' && config.styling !== 'css')`
- **Severity**: Critical - Complete feature non-functional for common use case

#### Package Manager CLI Tools
- Fixed Tailwind CSS initialization failing with pnpm, yarn, and bun package managers
- Fixed shadcn/ui initialization failing with pnpm, yarn, and bun
- Fixed Prisma initialization failing with pnpm, yarn, and bun
- Fixed Playwright initialization always using npm instead of chosen package manager
- Changed from hardcoded `npx`/`npm init` to package manager specific commands:
  - npm: `npx` / `npm init`
  - yarn: `yarn` / `yarn dlx` / `yarn create`
  - pnpm: `pnpm exec` / `pnpm dlx` / `pnpm create`
  - bun: `bunx` / `bun create`
- Resolved "Command failed with exit code 1" errors with non-npm package managers

### Added
- Comprehensive testing suite with 5 test files covering 18 scenarios
- Test scripts: test-all-scenarios.js, test-package-managers.js, test-tailwind-edge-cases.js, test-shadcn-edge-cases.js, test-backend-edge-cases.js
- TEST_SUITE_README.md with complete testing documentation
- TESTING_GUIDE.md with manual testing instructions
- CRITICAL_BUG_FIXED.md documenting the hasAddons issue

## [1.1.0] - 2026-01-31

### Added

- **Live NPM Version Fetching** - Automatically fetches latest package versions from npm registry using custom `versionFetcher.js` utility
- **New State Management Libraries**:
  - Redux Toolkit & React Redux (industry-standard state management)
  - Jotai (atomic state management)
- **New Frontend Libraries**:
  - React Router (client-side routing)
  - React Icons (popular icon library)
  - Radix UI (headless accessible components)
  - ShadCN UI (beautiful component library)
- **Bun Package Manager** - Added full support for bun as a package manager option
- **Enhanced Documentation**:
  - Added comprehensive Troubleshooting section to README
  - Added Recent Updates section
  - Added Demo GIF section
  - Updated library listings with new additions

### Fixed

- **TypeScript Configuration Errors**: Fixed `No inputs were found in config file` error in Next.js, Vue, and Fullstack templates
  - Changed tsconfig include patterns from `**/*.ts` to explicit `src/**/*.ts` patterns
  - Added proper exclude configurations
- **Express Backend Directory Structure**: Fixed `ENOENT: no such file or directory` errors when creating backend with feature-based structure
  - Added dynamic directory path resolution based on folder structure type
  - Feature-based now correctly uses `src/shared/config/` instead of `src/config/`
  - Clean architecture uses proper `src/presentation/middleware/` paths
  - Added `fs.ensureDir()` calls before writing configuration files
- **Package Manager Commands**: Fixed yarn command from `yarn` to `yarn install`
- **Fullstack Template Import**: Fixed import statement to use named export instead of default export

### Changed

- **All Templates Updated**: React, Next.js, Vue, Express, and Fullstack templates now fetch actual latest versions from npm
  - React: ^19.2.4, Vite: ^7.3.1, Redux Toolkit: ^2.11.2
  - Next.js: ^16.1.11, TypeScript: ^5.9.3
  - Vue: ^3.5.13, Pinia, Vue Router
  - Express: ^5.2.1, Prisma: ^7.3.0
  - Turbo: ^3.4.1, Concurrently: ^9.2.0
- **Version Fetcher**: Implemented with spinner feedback and fallback mechanism for network failures
- **Package Manager Support**: Extended from npm, yarn, pnpm to include bun

### Improved

- Better error messages with troubleshooting suggestions
- Enhanced directory structure handling across all Express architecture patterns (MVC, Layered, Feature-based, Clean Architecture)
- More robust fallback handling when npm registry is unreachable

## [1.0.0] - 2026-01-15

### Added

- Initial release of InitKit CLI
- **Project Types**: Frontend Only, Backend Only, Full Stack, Node.js Library
- **Frontend Frameworks**: React, Vue, Angular, Svelte, Next.js, Nuxt.js, Vanilla JS
- **Backend Frameworks**: Express, Fastify, Koa, NestJS, Hapi
- **Databases**: PostgreSQL, MySQL, MongoDB, SQLite
- **Folder Structures**: Feature-based, Type-based, Domain-driven, Flat
- **Styling Solutions**: Tailwind CSS, CSS Modules, Styled Components, Emotion, Sass, Plain CSS
- **Development Tools**: ESLint, Prettier, Husky, Lint-staged, Docker, GitHub Actions
- **Full Stack Architectures**:
  - Monorepo with Turborepo (shared packages, types, UI components)
  - Traditional stacks (MERN, PERN, Next.js + Express, Laravel + React)
- **Package Managers**: npm, yarn, pnpm support
- **Interactive CLI**: 13-question flow with real-time validation
- **Smart Validation**: npm package name validation with helpful suggestions
- **Automatic Rollback**: Transaction-like cleanup on installation failures
- **Enhanced CLI UX**: Colored output, formatted boxes, progress spinners
- **Comprehensive Documentation**:
  - Quick Start Guide (350 lines)
  - Advanced Configuration Guide (930 lines)
  - Architecture Documentation (800 lines)
  - Contributing Guide (500 lines)
  - Question Flow visualization
  - JSDoc comments on all functions (200+ blocks)
- **Testing**: 44% test coverage with Jest (unit + integration tests)
- **ES Modules**: Modern ESM architecture throughout

### Features

- Real-time package name validation with colored feedback (✓/✗)
- Context-aware prompts that adapt based on project type
- Essential starter files for React, Next.js, and Vue projects
- Docker multi-stage builds and docker-compose orchestration
- API integration with axios interceptors
- Environment variable management with .env templates
- Git initialization with comprehensive .gitignore
- CI/CD pipeline templates (GitHub Actions)

---

## Upcoming Features (Roadmap)

### Version 1.2.0 (Planned)

- [ ] Astro framework support
- [ ] Remix framework support
- [ ] Solid.js support
- [ ] Qwik framework support
- [ ] Deno runtime support
- [ ] More backend frameworks (Hono, Elysia, Fastify plugins)
- [ ] Database migrations setup (Prisma, TypeORM, Drizzle)
- [ ] More testing frameworks (Playwright, Cypress)
- [ ] Storybook integration for component development
- [ ] GraphQL setup with Apollo or Relay

### Version 1.3.0 (Planned)

- [ ] Custom template support from Git repositories
- [ ] Plugin system for community extensions
- [ ] Interactive template builder (GUI)
- [ ] Project upgrade command (migrate to newer versions)
- [ ] Template marketplace
- [ ] AI-powered project recommendations

### Version 2.0.0 (Future)

- [ ] Web-based project configurator
- [ ] VS Code extension
- [ ] Cloud deployment integration (Vercel, Netlify, AWS)
- [ ] Multi-language support (i18n for CLI)
- [ ] Team collaboration features (shared templates)

---

## Version Naming Convention

InitKit follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes, major architecture updates
- **MINOR** (1.X.0): New features, new frameworks, backwards-compatible
- **PATCH** (1.1.X): Bug fixes, documentation updates, minor improvements

---

## How to Upgrade

### Global Installation

```bash
npm update -g initkit
```

### Check Current Version

```bash
initkit --version
```

### View Changelog

```bash
initkit info  # Shows version and recent changes
```

---

## Migration Guides

### Upgrading from 1.0.0 to 1.1.0

**No breaking changes** - This is a backwards-compatible update with bug fixes and new features.

**What's New:**

- Latest package versions fetched automatically from npm
- New libraries available (Redux Toolkit, Jotai, React Router, Radix UI)
- Bun package manager support
- Fixed TypeScript and Express directory bugs

**Action Required:** None - just update InitKit globally.

**Existing Projects:** Not affected - this update only improves new project generation.

---

## Support

- **Documentation**: [Full Docs](./docs/QUICK_START.md)
- **Issues**: [GitHub Issues](https://github.com/shirishshrestha/initkit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/shirishshrestha/initkit/discussions)

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to InitKit.

---

[1.1.0]: https://github.com/shirishshrestha/initkit/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/shirishshrestha/initkit/releases/tag/v1.0.0
