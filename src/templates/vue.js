import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { getLatestVersion } from '../utils/versionFetcher.js';

async function fetchVersion(packageName, fallback = 'latest') {
  try {
    const version = await getLatestVersion(packageName);
    return `^${version}`;
  } catch {
    return fallback;
  }
}

/**
 * Generate Vue 3 + Vite project with Composition API
 *
 * Creates a modern Vue 3 single-page application using:
 * - Vue 3 with Composition API
 * - Vite for fast development and optimized builds
 * - TypeScript or JavaScript support
 * - Vue Router for navigation
 * - Pinia for state management (optional)
 *
 * Generated project includes:
 * - Vite configuration with Vue plugin
 * - Folder structure based on preference
 * - Package.json with Vue 3 and Vite dependencies
 * - README with getting started instructions
 *
 * @param {string} projectPath - Absolute path to the project directory
 * @param {Object} config - User configuration object
 * @param {string} config.projectName - Name of the project
 * @param {string} config.language - Programming language ('typescript'|'javascript')
 * @param {string} [config.folderStructure='feature-based'] - Folder organization pattern
 *   - 'feature-based': Organize by features with composables (recommended)
 *   - 'component-based': Organize by component types
 *   - 'type-based': Organize by file type (components, composables, utils)
 * @param {string} config.packageManager - Package manager to use
 *
 * @returns {Promise<void>}
 *
 * @example
 * // Create Vue 3 + Vite project with TypeScript
 * await generateVueTemplate('/path/to/project', {
 *   projectName: 'my-vue-app',
 *   language: 'typescript',
 *   folderStructure: 'feature-based',
 *   packageManager: 'npm'
 * });
 */
export async function generateVueTemplate(projectPath, config) {
  // Create folder structure only
  await createVueFolderStructure(projectPath, config);

  // Generate package.json
  await generateVuePackageJson(projectPath, config);

  // Generate essential files (App.vue, main.js, etc.)
  await generateVueEssentialFiles(projectPath, config);

  // Generate README
  await generateVueReadme(projectPath, config);
}

async function createVueFolderStructure(projectPath, config) {
  const srcPath = path.join(projectPath, 'src');
  const publicPath = path.join(projectPath, 'public');
  const folderStructure = config.folderStructure || 'feature-based';

  await fs.ensureDir(publicPath);

  if (folderStructure === 'feature-based') {
    // Feature-based structure
    const features = ['auth', 'dashboard', 'profile'];

    for (const feature of features) {
      const featurePath = path.join(srcPath, 'features', feature);
      await fs.ensureDir(path.join(featurePath, 'components'));
      await fs.ensureDir(path.join(featurePath, 'composables'));
      await fs.ensureDir(path.join(featurePath, 'types'));

      // Create barrel export
      await fs.writeFile(path.join(featurePath, 'index.ts'), generateBarrelExport(feature));
    }
  } else if (folderStructure === 'component-based') {
    // Component-based structure
    await fs.ensureDir(path.join(srcPath, 'components', 'common'));
    await fs.ensureDir(path.join(srcPath, 'components', 'layout'));
    await fs.ensureDir(path.join(srcPath, 'components', 'forms'));

    // Create barrel exports
    await fs.writeFile(
      path.join(srcPath, 'components', 'common', 'index.ts'),
      `// Export common components\n// TODO: Add your components here\n`
    );
  }

  // Common folders
  await fs.ensureDir(path.join(srcPath, 'assets', 'styles'));
  await fs.ensureDir(path.join(srcPath, 'assets', 'images'));
  await fs.ensureDir(path.join(srcPath, 'router'));
  await fs.ensureDir(path.join(srcPath, 'stores'));
  await fs.ensureDir(path.join(srcPath, 'composables'));
  await fs.ensureDir(path.join(srcPath, 'types'));
  await fs.ensureDir(path.join(srcPath, 'utils'));
  await fs.ensureDir(path.join(srcPath, 'services'));
}

async function generateVuePackageJson(projectPath, config) {
  const { language, styling, additionalLibraries = [] } = config;
  const useTypeScript = language === 'typescript';

  const spinner = ora('Fetching latest package versions...').start();

  try {
    // Fetch core dependencies
    const [vueVer, vueRouterVer, piniaVer, pluginVer, viteVer] = await Promise.all([
      fetchVersion('vue'),
      fetchVersion('vue-router'),
      fetchVersion('pinia'),
      fetchVersion('@vitejs/plugin-vue'),
      fetchVersion('vite'),
    ]);

    const dependencies = {
      vue: vueVer,
      'vue-router': vueRouterVer,
      pinia: piniaVer,
    };

    const devDependencies = {
      '@vitejs/plugin-vue': pluginVer,
      vite: viteVer,
    };

    // TypeScript dependencies
    if (useTypeScript) {
      const [tsVer, vueTscVer] = await Promise.all([
        fetchVersion('typescript'),
        fetchVersion('vue-tsc'),
      ]);
      devDependencies['typescript'] = tsVer;
      devDependencies['vue-tsc'] = vueTscVer;
    }

    // Add Tailwind
    if (styling === 'tailwind') {
      devDependencies['tailwindcss'] = await fetchVersion('tailwindcss');
    }

    // Add libraries
    if (additionalLibraries.includes('tanstack-query')) {
      dependencies['@tanstack/vue-query'] = await fetchVersion('@tanstack/vue-query');
    }

    if (additionalLibraries.includes('axios')) {
      dependencies['axios'] = await fetchVersion('axios');
    }

    if (additionalLibraries.includes('vueuse')) {
      dependencies['@vueuse/core'] = await fetchVersion('@vueuse/core');
    }

    if (additionalLibraries.includes('vee-validate')) {
      const [veeValidateVer, zodVer, veeZodVer] = await Promise.all([
        fetchVersion('vee-validate'),
        fetchVersion('zod'),
        fetchVersion('@vee-validate/zod'),
      ]);
      dependencies['vee-validate'] = veeValidateVer;
      dependencies['zod'] = zodVer;
      dependencies['@vee-validate/zod'] = veeZodVer;
    }

    spinner.succeed(chalk.green('Fetched latest versions'));

    const packageJson = {
      name: config.projectName,
      version: '0.0.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: useTypeScript ? 'vue-tsc && vite build' : 'vite build',
        preview: 'vite preview',
      },
      dependencies,
      devDependencies,
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
  } catch (error) {
    spinner.fail(chalk.yellow('Could not fetch versions, using fallbacks'));

    // Fallback with latest tag
    const dependencies = { vue: 'latest', 'vue-router': 'latest', pinia: 'latest' };
    const devDependencies = {
      '@vitejs/plugin-vue': 'latest',
      vite: 'latest',
      ...(useTypeScript && { typescript: 'latest', 'vue-tsc': 'latest' }),
    };

    if (styling === 'tailwind') devDependencies['tailwindcss'] = 'latest';
    if (additionalLibraries.includes('tanstack-query'))
      dependencies['@tanstack/vue-query'] = 'latest';
    if (additionalLibraries.includes('axios')) dependencies['axios'] = 'latest';
    if (additionalLibraries.includes('vueuse')) dependencies['@vueuse/core'] = 'latest';
    if (additionalLibraries.includes('vee-validate')) {
      dependencies['vee-validate'] = 'latest';
      dependencies['zod'] = 'latest';
      dependencies['@vee-validate/zod'] = 'latest';
    }

    const packageJson = {
      name: config.projectName,
      version: '0.0.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: useTypeScript ? 'vue-tsc && vite build' : 'vite build',
        preview: 'vite preview',
      },
      dependencies,
      devDependencies,
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
  }
}

async function generateVueEssentialFiles(projectPath, config) {
  const { language } = config;
  const isTypeScript = language === 'typescript';
  const srcPath = path.join(projectPath, 'src');

  // Create App.vue
  const appVueContent = `<script setup${isTypeScript ? ' lang="ts"' : ''}>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div id="app">
    <h1>Welcome to ${config.projectName}</h1>
    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        Edit <code>src/App.vue</code> to test HMR
      </p>
    </div>
    <p class="read-the-docs">
      Click on the Vue logo to learn more
    </p>
  </div>
</template>

<style scoped>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}
</style>
`;

  await fs.writeFile(path.join(srcPath, 'App.vue'), appVueContent);

  // Create main entry point
  const mainContent = `import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
`;

  await fs.writeFile(path.join(srcPath, isTypeScript ? 'main.ts' : 'main.js'), mainContent);

  // Create style.css
  const styleCssContent = `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
`;

  await fs.writeFile(path.join(srcPath, 'style.css'), styleCssContent);

  // Create vite.config
  const viteConfigContent = isTypeScript
    ? `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})
`
    : `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})
`;

  await fs.writeFile(
    path.join(projectPath, `vite.config.${isTypeScript ? 'ts' : 'js'}`),
    viteConfigContent
  );

  // Create index.html in project root
  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.projectName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.${isTypeScript ? 'ts' : 'js'}"></script>
  </body>
</html>
`;

  await fs.writeFile(path.join(projectPath, 'index.html'), indexHtmlContent);

  // Create .gitignore
  const gitignoreContent = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
.DS_Store
dist
dist-ssr
coverage
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);

  // Create tsconfig if TypeScript
  if (isTypeScript) {
    const tsconfigContent = {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        module: 'ESNext',
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        skipLibCheck: true,

        /* Bundler mode */
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: 'force',
        noEmit: true,
        jsx: 'preserve',

        /* Linting */
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      exclude: ['node_modules', 'dist'],
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsconfigContent, { spaces: 2 });
  }
}

async function generateVueReadme(projectPath, config) {
  const { projectName, folderStructure, language, styling, packageManager } = config;

  const readme = `# ${projectName}

Created with InitKit CLI

## Setup

1. Install dependencies:
\`\`\`bash
${packageManager} install
\`\`\`

2. Run the development server:
\`\`\`bash
${packageManager} ${packageManager === 'npm' ? 'run ' : ''}dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Vue 3** - Progressive framework
- **Vite 6** - Build tool
- **Vue Router** - Official router
- **Pinia** - State management${language === 'typescript' ? '\n- **TypeScript** - Type safety' : ''}${styling === 'tailwind' ? '\n- **Tailwind CSS v4** - Styling' : ''}

## Folder Structure

\`\`\`
src/
${
  folderStructure === 'feature-based'
    ? `├── features/       # Feature modules
│   ├── auth/       # Authentication
│   ├── dashboard/  # Dashboard
│   └── profile/    # User profile
├── shared/         # Shared code`
    : `├── components/     # Vue components
│   ├── common/     # Common components
│   ├── layout/     # Layout components
│   └── forms/      # Form components`
}
├── router/         # Vue Router configuration
├── stores/         # Pinia stores
├── composables/    # Composition API composables
├── assets/         # Static assets
└── public/         # Public files
\`\`\`

## Next Steps

1. Run \`npm create vue@latest . -- --${language === 'typescript' ? 'typescript' : 'javascript'}\` to initialize Vue${styling === 'tailwind' ? '\n2. Install Tailwind v4: `' + packageManager + (packageManager === 'npm' ? ' install' : ' add') + ' tailwindcss@next`' : ''}
3. Start building in \`src/features/\`
4. Add environment variables in \`.env\`

---

Built with InitKit
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

function generateBarrelExport(featureName) {
  return `// ${featureName.toUpperCase()} Feature

// TODO: Export your components
// export { default as ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Component } from './components/${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Component.vue';

// TODO: Export your composables
// export { use${featureName.charAt(0).toUpperCase() + featureName.slice(1)} } from './composables/use${featureName.charAt(0).toUpperCase() + featureName.slice(1)}';

// TODO: Export your types
// export type * from './types/${featureName}.types';
`;
}
