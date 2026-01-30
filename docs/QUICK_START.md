# InitKit Quick Start Guide

Get up and running with InitKit in under 5 minutes!

## Installation

### Global Installation (Recommended)

```bash
npm install -g initkit
```

### Verify Installation

```bash
initkit --version
```

You should see the version number displayed.

## Your First Project

### 1. Start the CLI

```bash
initkit
```

This launches the interactive wizard.

### 2. Follow the Prompts

The CLI will ask you 13 questions to customize your project:

**Basic Setup:**
1. **Project Name** - Enter a valid npm package name
2. **Project Type** - Choose: Frontend, Backend, Full Stack, or Library

**Framework Selection:**
3. **Frontend Framework** - React, Vue, Next.js, etc. (if applicable)
4. **Backend Framework** - Express, NestJS, Fastify, etc. (if applicable)
5. **Database** - PostgreSQL, MongoDB, MySQL, etc. (if applicable)

**Configuration:**
6. **Language** - TypeScript (recommended) or JavaScript
7. **Folder Structure** - Feature-based, Type-based, Domain-driven, or Flat
8. **TypeScript Strictness** - Strict, Moderate, or Relaxed (if TS)

**Styling & Tools:**
9. **Styling** - Tailwind, CSS Modules, Styled Components, etc.
10. **Additional Libraries** - Select from curated list
11. **Development Features** - Testing, Docker, CI/CD, etc.

**Setup:**
12. **Package Manager** - npm, yarn, or pnpm
13. **Git** - Initialize Git repository?

### 3. Project Generation

InitKit will:
- ✅ Create project structure
- ✅ Generate configuration files
- ✅ Set up dependencies
- ✅ Initialize Git (if selected)
- ✅ Display comprehensive summary

## Common Scenarios

### Scenario 1: React SPA with TypeScript

```bash
initkit my-react-app
```

**Selections:**
- Project Type: **Frontend Only**
- Framework: **React**
- Language: **TypeScript**
- Folder Structure: **Feature-based**
- Styling: **Tailwind CSS**
- Features: **ESLint + Prettier**
- Package Manager: **npm**
- Git: **Yes**

**Result:**
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
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

### Scenario 2: Express API

```bash
initkit my-api
```

**Selections:**
- Project Type: **Backend Only**
- Framework: **Express**
- Database: **PostgreSQL**
- ORM: **Prisma**
- Language: **TypeScript**
- Folder Structure: **MVC**
- Features: **Docker + ESLint**

**Result:**
```
my-api/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── Dockerfile
├── .env.example
└── package.json
```

### Scenario 3: Full-Stack Monorepo

```bash
initkit my-fullstack-app
```

**Selections:**
- Project Type: **Full Stack**
- Architecture: **Monorepo (Turborepo)**
- Frontend: **Next.js**
- Backend: **Express**
- Database: **MongoDB**
- Language: **TypeScript**
- Features: **Docker Compose + GitHub Actions**

**Result:**
```
my-fullstack-app/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Express backend
├── packages/
│   ├── shared-types/     # Shared TypeScript types
│   └── ui-components/    # Shared React components
├── turbo.json
├── docker-compose.yml
└── package.json
```

## Quick Commands

### Skip Interactive Prompts

Use defaults for rapid prototyping:

```bash
initkit quick-app --yes
```

This creates a full-stack app with:
- React frontend
- Express backend
- TypeScript
- Feature-based structure
- Essential tools (ESLint, Prettier)

### List Available Templates

```bash
initkit list
```

Shows all supported frameworks and databases.

### Get CLI Information

```bash
initkit info
```

Displays version, description, and repository info.

## Next Steps

After project creation:

### 1. Navigate to Project

```bash
cd my-project-name
```

### 2. Install Dependencies

If you skipped installation:

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Open in Browser

- **Frontend**: http://localhost:5173 (Vite) or http://localhost:3000 (Next.js)
- **Backend**: http://localhost:3000 or your configured port

## Common Issues

### Issue: "Command not found: initkit"

**Solution:**
```bash
# Reinstall globally
npm install -g initkit

# Or use npx
npx initkit
```

### Issue: "Project name is invalid"

**Solution:**
- Use lowercase letters
- Use hyphens for spaces
- Avoid special characters
- Max 214 characters

**Valid names:**
- `my-project`
- `awesome-app`
- `project-name-123`

**Invalid names:**
- `My Project` (spaces/uppercase)
- `@special` (special chars)
- `_project` (leading underscore)

### Issue: "Directory already exists"

**Solution:**
```bash
# Use a different name
initkit my-project-v2

# Or remove existing directory
rm -rf my-project
initkit my-project
```

### Issue: "npm install failed"

**Solution:**
```bash
# Navigate to project
cd my-project

# Try manual installation
npm install

# Or use a different package manager
yarn install
# or
pnpm install
```

## Tips & Tricks

### 1. Use Arrow Keys

Navigate prompts with ↑↓ arrow keys and press Enter to select.

### 2. Multi-Select

For "Additional Libraries" and "Features", use:
- **Space** to toggle selection
- **Enter** to confirm

### 3. Default Values

Press Enter to accept default values (shown in parentheses).

### 4. Skip Questions

Use CLI flags to skip specific questions:

```bash
initkit my-app --typescript --no-git --package-manager yarn
```

### 5. Verbose Output

See detailed logs:

```bash
initkit my-app --verbose
```

### 6. Graceful Exit

Press `Ctrl+C` to exit anytime. InitKit will clean up partially created projects.

## What's Next?

### Learn More

- **[User Guide](./user-guide.md)** - Detailed documentation
- **[Examples](./examples.md)** - Real-world project examples
- **[Architecture](./architecture.md)** - Technical deep dive
- **[Contributing](../CONTRIBUTING.md)** - Help improve InitKit

### Configure Your Project

- Set up environment variables (`.env`)
- Configure database connections
- Customize ESLint/Prettier rules
- Add custom scripts to `package.json`

### Deploy Your App

- Set up CI/CD with GitHub Actions
- Deploy frontend to Vercel/Netlify
- Deploy backend to Railway/Heroku
- Use Docker for containerization

## Getting Help

- **Documentation**: Read the [full docs](./user-guide.md)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/shirishshrestha/initkit/issues)
- **Discussions**: Ask questions on [GitHub Discussions](https://github.com/shirishshrestha/initkit/discussions)

Happy coding! 🚀
