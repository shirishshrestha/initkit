# InitKit Testing Guide

## Recent Fix: Tailwind CSS + Package Managers

**Issue**: `npx tailwindcss init -p` was failing with pnpm, yarn, and bun
**Fix**: Use package manager specific binary runners instead of hardcoded `npx`
**Commit**: 5f05076

---

## Manual Testing Instructions

### Test 1: React + Vite + Tailwind + shadcn (pnpm) - PRIMARY TEST ⭐
This was the failing scenario that we fixed.

```bash
node bin/index.js
```

**Answers**:
- Project type: `Frontend Only`
- Project name: `test-react-tailwind-pnpm`
- Framework: `React + Vite`
- Language: `TypeScript (Recommended)`
- Structure: `Feature-based (Organize by feature/module)`
- TS strictness: `Strict (Recommended for new projects)`
- Styling: `Tailwind CSS` ⚠️
- State management: `Redux Toolkit (Official Redux)`
- UI Library: `shadcn/ui (Radix + Tailwind)` ⚠️
- Auth: `None`
- Testing: (leave empty, press Enter)
- Additional libraries: `Axios (HTTP client)` (select one and press Enter)
- Dev tools: `ESLint (Code linting)` (select one and press Enter)
- Package manager: `pnpm` ⚠️
- Git: `Yes`

**Expected**: ✅ Project creates successfully without "No Tailwind CSS configuration found" error

**Verify**:
```bash
cd test-react-tailwind-pnpm
ls tailwind.config.js    # Should exist
ls postcss.config.js     # Should exist
cat src/index.css        # Should have @tailwind directives
cat tsconfig.json        # Should have @/* path alias
```

---

### Test 2: React + Vite + Tailwind (yarn)
Test Tailwind with yarn package manager.

```bash
node bin/index.js
```

**Answers**:
- Project type: `Frontend Only`
- Project name: `test-react-tailwind-yarn`
- Framework: `React + Vite`
- Language: `TypeScript (Recommended)`
- Structure: `Feature-based (Organize by feature/module)`
- TS strictness: `Strict (Recommended for new projects)`
- Styling: `Tailwind CSS`
- State management: `None`
- UI Library: `None`
- Auth: `None`
- Testing: (empty)
- Additional libraries: (empty)
- Dev tools: (empty)
- Package manager: `yarn` ⚠️
- Git: `No`

**Expected**: ✅ Creates successfully

---

### Test 3: React + Vite + Tailwind (bun)
Test Tailwind with bun package manager.

```bash
node bin/index.js
```

**Answers**:
- Project type: `Frontend Only`
- Project name: `test-react-tailwind-bun`
- Framework: `React + Vite`
- Language: `TypeScript (Recommended)`
- Structure: `Feature-based (Organize by feature/module)`
- TS strictness: `Strict (Recommended for new projects)`
- Styling: `Tailwind CSS`
- State management: `None`
- UI Library: `None`
- Auth: `None`
- Testing: (empty)
- Additional libraries: (empty)
- Dev tools: (empty)
- Package manager: `bun` ⚠️
- Git: `No`

**Expected**: ✅ Creates successfully

---

### Test 4: React + Vite + Tailwind (npm - baseline)
Test Tailwind with npm package manager (should have always worked).

```bash
node bin/index.js
```

**Answers**:
- Project type: `Frontend Only`
- Project name: `test-react-tailwind-npm`
- Framework: `React + Vite`
- Language: `TypeScript (Recommended)`
- Structure: `Feature-based (Organize by feature/module)`
- TS strictness: `Strict (Recommended for new projects)`
- Styling: `Tailwind CSS`
- State management: `None`
- UI Library: `None`
- Auth: `None`
- Testing: (empty)
- Additional libraries: (empty)
- Dev tools: (empty)
- Package manager: `npm` ⚠️
- Git: `No`

**Expected**: ✅ Creates successfully

---

### Test 5: Next.js + Tailwind (pnpm)
Test Tailwind with Next.js framework.

```bash
node bin/index.js
```

**Answers**:
- Project type: `Frontend Only`
- Project name: `test-nextjs-tailwind-pnpm`
- Framework: `Next.js`
- Language: `TypeScript (Recommended)`
- Structure: `Feature-based (Organize by feature/module)`
- TS strictness: `Strict (Recommended for new projects)`
- Styling: `Tailwind CSS`
- State management: `None`
- UI Library: `None`
- Auth: `None`
- Testing: (empty)
- Additional libraries: (empty)
- Dev tools: (empty)
- Package manager: `pnpm`
- Git: `No`

**Expected**: ✅ Creates successfully

---

### Test 6: Vue + Sass (bun)
Test other styling solutions still work.

```bash
node bin/index.js
```

**Answers**:
- Project type: `Frontend Only`
- Project name: `test-vue-sass-bun`
- Framework: `Vue`
- Language: `TypeScript (Recommended)`
- Structure: `Feature-based (Organize by feature/module)`
- TS strictness: `Strict (Recommended for new projects)`
- Styling: `Sass/SCSS`
- State management: `Pinia (Official Vue)`
- UI Library: `None`
- Auth: `None`
- Testing: (empty)
- Additional libraries: (empty)
- Dev tools: (empty)
- Package manager: `bun`
- Git: `No`

**Expected**: ✅ Creates successfully

---

### Test 7: Express Backend (npm)
Test backend still works.

```bash
node bin/index.js
```

**Answers**:
- Project type: `Backend Only`
- Project name: `test-express-npm`
- Framework: `Express`
- Language: `JavaScript`
- Structure: `Feature-based (Organize by feature/module)`
- Additional libraries: (empty)
- Dev tools: (empty)
- Package manager: `npm`
- Git: `No`

**Expected**: ✅ Creates successfully

---

## Quick Test Script

Run all tests quickly (copy-paste this):

```bash
# Clean up
rm -rf test-*

# Test 1: PRIMARY - React + Tailwind + shadcn + pnpm
echo "🧪 Test 1: React + Tailwind + shadcn + pnpm"
# (Run manually with answers above)

# Test 2: React + Tailwind + yarn
echo "🧪 Test 2: React + Tailwind + yarn"
# (Run manually)

# Test 3: React + Tailwind + bun
echo "🧪 Test 3: React + Tailwind + bun"
# (Run manually)

# Test 4: React + Tailwind + npm
echo "🧪 Test 4: React + Tailwind + npm"
# (Run manually)

# Test 5: Next.js + Tailwind + pnpm
echo "🧪 Test 5: Next.js + Tailwind + pnpm"
# (Run manually)

# Test 6: Vue + Sass + bun
echo "🧪 Test 6: Vue + Sass + bun"
# (Run manually)

# Test 7: Express + npm
echo "🧪 Test 7: Express + npm"
# (Run manually)
```

---

## Success Criteria

✅ **All 7 tests must pass without errors**

Key checks:
1. No "Command failed with exit code 1: npx tailwindcss init -p" error
2. No "No Tailwind CSS configuration found" error from shadcn
3. Project directories created successfully
4. `package.json` exists
5. For Tailwind tests: `tailwind.config.js` and `postcss.config.js` exist
6. For shadcn tests: `tsconfig.json` has `@/*` path alias

---

## After Testing

If all tests pass:

```bash
# Bump version
npm version patch  # 1.2.1 -> 1.2.2

# Push changes
git push origin develop
git push origin --tags

# Publish to npm
npm publish
```

If any test fails:
1. Check the error message
2. Review the relevant code in `src/utils/addonInstaller.js`
3. Fix and re-test
4. Don't publish until all tests pass

---

## Known Issues to Watch For

1. **Package manager not installed**: If user doesn't have pnpm/yarn/bun installed, test will fail
2. **Network issues**: NPM registry might be slow or unavailable
3. **Disk space**: Creating multiple projects requires disk space
4. **Existing directories**: Clean up test directories before each run

---

## Test Coverage

Current coverage:
- ✅ React + Vite
- ✅ Next.js
- ✅ Vue
- ✅ Express
- ✅ All 4 package managers (npm, yarn, pnpm, bun)
- ✅ Tailwind CSS
- ✅ shadcn/ui
- ✅ Sass
- ✅ TypeScript
- ✅ Git initialization

Not yet tested:
- ⏳ NestJS (coming soon)
- ⏳ Fastify (coming soon)
- ⏳ Other UI libraries (Material-UI, Ant Design, Chakra UI, Mantine, DaisyUI)
- ⏳ Other styling solutions (Styled Components, Emotion, CSS Modules)
- ⏳ Authentication solutions (Clerk, Auth0, Supabase, Firebase)
- ⏳ Testing frameworks (Jest, Vitest, Playwright, Cypress)
