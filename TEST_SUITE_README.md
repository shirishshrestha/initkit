# InitKit Test Suite

Comprehensive testing for all edge cases and scenarios in InitKit CLI.

## Test Files

### 1. `test-all-scenarios.js` - Comprehensive Test Suite

Tests 18 different scenarios covering:

- All frameworks (React, Next.js, Vue, Express)
- All package managers (npm, yarn, pnpm, bun)
- All styling solutions (Tailwind, Sass, Styled Components, Emotion, CSS)
- All UI libraries (shadcn, Material-UI, Chakra UI, Mantine, DaisyUI)
- All ORMs (Prisma, Drizzle, Mongoose)
- Minimal configurations
- Full-stack configurations

**Usage:**

```bash
# Run all 18 tests
node test-all-scenarios.js

# Run a specific test (1-18)
node test-all-scenarios.js 1
```

**Test Scenarios:**

1. React+Vite+Tailwind+shadcn+pnpm (Original failing case)
2. React+Vite+Tailwind+yarn
3. React+Vite+Tailwind+bun
4. Next.js+Tailwind+pnpm
5. Vue+Sass+bun
6. React+MaterialUI+npm
7. React+StyledComponents+Chakra+yarn
8. React+Emotion+Mantine+pnpm
9. Next.js+shadcn+Clerk+pnpm
10. React+AllLibraries+npm
11. Express+JavaScript+npm
12. Express+TypeScript+Prisma+PostgreSQL+pnpm
13. Express+Drizzle+MySQL+yarn
14. Express+Mongoose+bun
15. React+Minimal+npm
16. Next.js+FullStack+pnpm
17. Vue+CleanArchitecture+pnpm
18. React+Tailwind+DaisyUI+bun

---

### 2. `test-package-managers.js` - Package Manager Testing

Tests the same configuration with all 4 package managers to ensure compatibility.

**Usage:**

```bash
node test-package-managers.js
```

**Tests:**

- npm with React+Tailwind+shadcn
- yarn with React+Tailwind+shadcn
- pnpm with React+Tailwind+shadcn
- bun with React+Tailwind+shadcn

---

### 3. `test-tailwind-edge-cases.js` - Tailwind CSS Testing

Tests Tailwind CSS installation across different frameworks and package managers.

**Usage:**

```bash
node test-tailwind-edge-cases.js
```

**Tests:**

- React+Tailwind with pnpm, yarn, bun
- Next.js+Tailwind with pnpm
- Vue+Tailwind with yarn

---

### 4. `test-shadcn-edge-cases.js` - shadcn/ui Testing

Tests shadcn/ui installation with all package managers (requires Tailwind CSS).

**Usage:**

```bash
node test-shadcn-edge-cases.js
```

**Tests:**

- shadcn+npm
- shadcn+yarn
- shadcn+pnpm
- shadcn+bun

---

### 5. `test-backend-edge-cases.js` - Backend & ORM Testing

Tests backend project creation with different ORMs and package managers.

**Usage:**

```bash
node test-backend-edge-cases.js
```

**Tests:**

- Express+Prisma+PostgreSQL+pnpm
- Express+Prisma+MySQL+yarn
- Express+Drizzle+PostgreSQL+bun
- Express+Mongoose+MongoDB+npm

---

## Quick Start

### Run Critical Tests Only

Test the most common failure scenarios:

```bash
# Test the original failing case
node test-all-scenarios.js 1

# Test all package managers
node test-package-managers.js

# Test shadcn with all package managers
node test-shadcn-edge-cases.js
```

### Run Full Test Suite

Test all 18 scenarios (takes ~60 minutes):

```bash
node test-all-scenarios.js
```

### Run Focused Tests

Test specific categories:

```bash
# Tailwind CSS across frameworks
node test-tailwind-edge-cases.js

# Backend & ORM combinations
node test-backend-edge-cases.js
```

---

## Test Results

Each test will:

1. ✅ Create the project
2. ✅ Verify key files exist
3. ✅ Report success/failure
4. ✅ Show execution time

Example output:

```
============================================================
🧪 Test 1/18: React+Vite+Tailwind+shadcn+pnpm
============================================================
Project: test-react-tailwind-shadcn-pnpm
Type: frontend
Timeout: 180s

✓ Cleaned up existing project
✓ Project directory created
✓ All required files exist:
  ✓ tailwind.config.js
  ✓ postcss.config.js
  ✓ src/index.css
  ✓ tsconfig.json

✅ SUCCESS: React+Vite+Tailwind+shadcn+pnpm (145.32s)
```

---

## What's Tested

### Package Managers

- ✅ npm
- ✅ yarn
- ✅ pnpm
- ✅ bun

### Frontend Frameworks

- ✅ React + Vite
- ✅ Next.js
- ✅ Vue

### Backend Frameworks

- ✅ Express

### Styling Solutions

- ✅ Tailwind CSS
- ✅ Sass/SCSS
- ✅ Styled Components
- ✅ Emotion
- ✅ CSS (no framework)

### UI Libraries

- ✅ shadcn/ui
- ✅ Material-UI
- ✅ Chakra UI
- ✅ Mantine
- ✅ DaisyUI

### State Management

- ✅ Redux Toolkit
- ✅ Zustand
- ✅ Jotai
- ✅ Recoil
- ✅ Pinia (Vue)

### ORMs

- ✅ Prisma
- ✅ Drizzle
- ✅ Mongoose

### Authentication

- ✅ Clerk

---

## Edge Cases Covered

1. **Package Manager Binary Runners**
   - npm: `npx`
   - yarn: `yarn` / `yarn dlx`
   - pnpm: `pnpm exec` / `pnpm dlx`
   - bun: `bunx`

2. **Tailwind CSS Initialization**
   - Tests that `tailwindcss init -p` works with all package managers
   - Verifies config files are created
   - Checks CSS directives are added

3. **shadcn/ui Prerequisites**
   - Ensures Tailwind is installed first
   - Verifies tsconfig path aliases are configured
   - Tests shadcn CLI works with all package managers

4. **Prisma Initialization**
   - Tests Prisma init with different databases
   - Verifies schema.prisma is created
   - Checks .env file is generated

5. **Minimal vs Full Configurations**
   - Tests projects with no addons
   - Tests projects with all addons
   - Ensures both work correctly

6. **Folder Structures**
   - Feature-based
   - Clean Architecture
   - Flat structure

---

## Cleanup

After testing, clean up all test projects:

```bash
# Remove all test projects
rm -rf test-*

# Or keep them for inspection
# Projects are named: test-[scenario]-[pm]
```

---

## Troubleshooting

### Tests Timing Out

- Increase timeout in test file (default: 180s)
- Check network connection (npm registry access)

### Tests Failing

- Ensure you have the package manager installed (npm, yarn, pnpm, bun)
- Check disk space
- Verify no processes are locking directories

### Specific Package Manager Fails

- Check if the package manager is installed: `npm -v`, `yarn -v`, `pnpm -v`, `bun -v`
- Install missing package managers:
  ```bash
  npm install -g yarn pnpm
  # or
  curl -fsSL https://bun.sh/install | bash
  ```

---

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# GitHub Actions example
name: Test InitKit
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install -g pnpm yarn bun
      - run: node test-all-scenarios.js
```

---

## Contributing

When adding new features:

1. Add test scenarios to `test-all-scenarios.js`
2. Create focused test files for new edge cases
3. Update this README with new test information
4. Ensure all tests pass before submitting PR

---

## Performance

Approximate test execution times:

- Single test: 1-3 minutes
- Package manager tests: 10-15 minutes
- Tailwind tests: 15-20 minutes
- shadcn tests: 15-20 minutes
- Backend tests: 10-15 minutes
- Full suite (18 tests): 45-60 minutes

---

## License

MIT - See LICENSE file for details
