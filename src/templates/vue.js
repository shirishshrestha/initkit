import fs from 'fs-extra';
import path from 'path';

/**
 * Generate Vue 3 + Vite template
 * @param {string} projectPath - Path to the project directory
 * @param {Object} config - User's project configuration
 */
async function generateVueTemplate(projectPath, config) {
  // Create folder structure
  await createVueFolderStructure(projectPath, config);

  // Generate configuration files
  await generateVueConfig(projectPath, config);

  // Generate app files
  await generateVueAppFiles(projectPath, config);

  // Generate index.html
  await generateVueIndexHtml(projectPath, config);

  // Generate package.json
  await generateVuePackageJson(projectPath, config);

  // Generate README
  await generateVueReadme(projectPath, config);
}

async function createVueFolderStructure(projectPath, config) {
  const srcPath = path.join(projectPath, 'src');
  const publicPath = path.join(projectPath, 'public');

  await fs.ensureDir(publicPath);

  const folderStructure = config.folderStructure || 'feature-based';

  if (folderStructure === 'feature-based') {
    // Feature-based structure
    const features = ['auth', 'dashboard', 'profile'];
    
    for (const feature of features) {
      const featurePath = path.join(srcPath, 'features', feature);
      await fs.ensureDir(path.join(featurePath, 'components'));
      await fs.ensureDir(path.join(featurePath, 'composables'));
      await fs.ensureDir(path.join(featurePath, 'types'));
      
      // Create barrel export
      await generateBarrelExport(path.join(featurePath, 'index.ts'), feature);
    }
  } else if (folderStructure === 'component-based') {
    // Component-based structure
    await fs.ensureDir(path.join(srcPath, 'components', 'common'));
    await fs.ensureDir(path.join(srcPath, 'components', 'layout'));
    await fs.ensureDir(path.join(srcPath, 'components', 'forms'));
    
    // Create barrel exports
    await generateBarrelExport(path.join(srcPath, 'components', 'common', 'index.ts'), 'common');
    await generateBarrelExport(path.join(srcPath, 'components', 'layout', 'index.ts'), 'layout');
    await generateBarrelExport(path.join(srcPath, 'components', 'forms', 'index.ts'), 'forms');
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

async function generateVueConfig(projectPath, config) {
  const useTypeScript = config.language === 'typescript';
  const styling = config.styling || 'tailwind';

  // vite.config.ts/js
  const viteConfig = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@composables': path.resolve(__dirname, './src/composables'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
`;

  await fs.writeFile(
    path.join(projectPath, `vite.config.${useTypeScript ? 'ts' : 'js'}`),
    viteConfig
  );

  // TypeScript configs if needed
  if (useTypeScript) {
    const strictness = config.typescript?.strictness || 'strict';
    
    const tsconfig = {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        module: 'ESNext',
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        skipLibCheck: true,

        /* Bundler mode */
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'preserve',

        /* Linting */
        strict: strictness === 'strict',
        noUnusedLocals: strictness === 'strict',
        noUnusedParameters: strictness === 'strict',
        noFallthroughCasesInSwitch: true,
        
        /* Path aliases */
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
          '@components/*': ['./src/components/*'],
          '@features/*': ['./src/features/*'],
          '@stores/*': ['./src/stores/*'],
          '@composables/*': ['./src/composables/*'],
          '@utils/*': ['./src/utils/*'],
          '@services/*': ['./src/services/*'],
          '@types/*': ['./src/types/*'],
        },
      },
      include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      references: [{ path: './tsconfig.node.json' }],
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsconfig, { spaces: 2 });

    // tsconfig.node.json
    const tsconfigNode = {
      compilerOptions: {
        composite: true,
        skipLibCheck: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        allowSyntheticDefaultImports: true,
      },
      include: ['vite.config.ts'],
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.node.json'), tsconfigNode, { spaces: 2 });
  }

  // ESLint config
  const eslintConfig = `module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    ${useTypeScript ? "'plugin:@typescript-eslint/recommended'," : ''}
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    ${useTypeScript ? "parser: '@typescript-eslint/parser'," : ''}
    sourceType: 'module',
  },
  plugins: ['vue'${useTypeScript ? ", '@typescript-eslint'" : ''}],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}
`;

  await fs.writeFile(path.join(projectPath, '.eslintrc.cjs'), eslintConfig);

  // Prettier config
  const prettierConfig = {
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
  };

  await fs.writeJSON(path.join(projectPath, '.prettierrc'), prettierConfig, { spaces: 2 });

  // Tailwind config if selected
  if (styling === 'tailwind') {
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

    await fs.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);

    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

    await fs.writeFile(path.join(projectPath, 'postcss.config.js'), postcssConfig);
  }
}

async function generateVueAppFiles(projectPath, config) {
  const srcPath = path.join(projectPath, 'src');
  const useTypeScript = config.language === 'typescript';
  const styling = config.styling || 'tailwind';

  // main.ts/js
  const mainContent = `import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
${styling === 'tailwind' ? "import './assets/styles/index.css'" : "import './assets/styles/main.css'"}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
`;

  await fs.writeFile(path.join(srcPath, `main.${useTypeScript ? 'ts' : 'js'}`), mainContent);

  // App.vue
  const appContent = `<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script${useTypeScript ? ' lang="ts"' : ''} setup>
// TODO: Add global app setup logic here
</script>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
`;

  await fs.writeFile(path.join(srcPath, 'App.vue'), appContent);

  // Router
  const routerContent = `import { createRouter, createWebHistory${useTypeScript ? ', type RouteRecordRaw' : ''} } from 'vue-router'
import HomeView from '../views/HomeView.vue'

${useTypeScript ? 'const routes: RouteRecordRaw[] = [' : 'const routes = ['}
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // Route-level code-splitting
    component: () => import('../views/AboutView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// TODO: Add navigation guards if needed
// router.beforeEach((to, from, next) => {
//   // Your logic here
//   next()
// })

export default router
`;

  await fs.ensureDir(path.join(srcPath, 'router'));
  await fs.writeFile(
    path.join(srcPath, 'router', `index.${useTypeScript ? 'ts' : 'js'}`),
    routerContent
  );

  // Create views
  await fs.ensureDir(path.join(srcPath, 'views'));

  const homeViewContent = `<template>
  <div class="home">
    <h1>Welcome to Vue 3</h1>
    <p>Your project is ready!</p>
    <!-- TODO: Add your home page content -->
  </div>
</template>

<script${useTypeScript ? ' lang="ts"' : ''} setup>
// TODO: Add home page logic
</script>

<style scoped>
.home {
  padding: 2rem;
}
</style>
`;

  await fs.writeFile(path.join(srcPath, 'views', 'HomeView.vue'), homeViewContent);

  const aboutViewContent = `<template>
  <div class="about">
    <h1>About</h1>
    <!-- TODO: Add your about page content -->
  </div>
</template>

<script${useTypeScript ? ' lang="ts"' : ''} setup>
// TODO: Add about page logic
</script>

<style scoped>
.about {
  padding: 2rem;
}
</style>
`;

  await fs.writeFile(path.join(srcPath, 'views', 'AboutView.vue'), aboutViewContent);

  // Create a sample store with Pinia
  const storeContent = `import { defineStore } from 'pinia'${useTypeScript ? "\nimport type { Ref } from 'vue'" : ''}

${useTypeScript ? 'interface AppState {\n  count: number\n}\n\n' : ''}export const useAppStore = defineStore('app', {
  state: ()${useTypeScript ? ': AppState' : ''} => ({
    count: 0,
  }),
  getters: {
    doubleCount${useTypeScript ? ': (state: AppState) => number' : ''} {
      return this.count * 2
    },
  },
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
  },
})
`;

  await fs.writeFile(
    path.join(srcPath, 'stores', `app.${useTypeScript ? 'ts' : 'js'}`),
    storeContent
  );

  // CSS
  const cssContent = styling === 'tailwind' 
    ? `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom styles here */
`
    : `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Your custom styles here */
`;

  await fs.writeFile(
    path.join(srcPath, 'assets', 'styles', styling === 'tailwind' ? 'index.css' : 'main.css'),
    cssContent
  );
}

async function generateVueIndexHtml(projectPath, config) {
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.projectName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.${config.language === 'typescript' ? 'ts' : 'js'}"></script>
  </body>
</html>
`;

  await fs.writeFile(path.join(projectPath, 'index.html'), indexHtml);
}

async function generateVuePackageJson(projectPath, config) {
  const useTypeScript = config.language === 'typescript';
  const styling = config.styling || 'tailwind';
  const packageManager = config.packageManager || 'npm';

  const packageJson = {
    name: config.projectName,
    version: '0.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: useTypeScript ? 'vue-tsc && vite build' : 'vite build',
      preview: 'vite preview',
      lint: `eslint . --ext .vue,.js${useTypeScript ? ',.ts' : ''} --fix`,
      format: 'prettier --write "src/**/*.{js,ts,vue,css,scss}"',
    },
    dependencies: {
      vue: '^3.4.21',
      'vue-router': '^4.3.0',
      pinia: '^2.1.7',
    },
    devDependencies: {
      '@vitejs/plugin-vue': '^5.0.4',
      vite: '^5.2.0',
      'eslint': '^8.57.0',
      'eslint-plugin-vue': '^9.23.0',
      'eslint-config-prettier': '^9.1.0',
      'prettier': '^3.2.5',
    },
  };

  // Add TypeScript dependencies
  if (useTypeScript) {
    packageJson.devDependencies['typescript'] = '^5.4.0';
    packageJson.devDependencies['vue-tsc'] = '^2.0.6';
    packageJson.devDependencies['@typescript-eslint/parser'] = '^7.4.0';
    packageJson.devDependencies['@typescript-eslint/eslint-plugin'] = '^7.4.0';
  }

  // Add Tailwind CSS dependencies
  if (styling === 'tailwind') {
    packageJson.devDependencies['tailwindcss'] = '^3.4.1';
    packageJson.devDependencies['postcss'] = '^8.4.38';
    packageJson.devDependencies['autoprefixer'] = '^10.4.19';
  }

  // Add libraries based on config
  if (config.libraries?.includes('tanstack-query')) {
    packageJson.dependencies['@tanstack/vue-query'] = '^5.28.0';
  }

  if (config.libraries?.includes('axios')) {
    packageJson.dependencies['axios'] = '^1.6.8';
  }

  if (config.libraries?.includes('vueuse')) {
    packageJson.dependencies['@vueuse/core'] = '^10.9.0';
  }

  if (config.libraries?.includes('vee-validate')) {
    packageJson.dependencies['vee-validate'] = '^4.12.6';
    packageJson.dependencies['zod'] = '^3.22.4';
    packageJson.dependencies['@vee-validate/zod'] = '^4.12.6';
  }

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
}

async function generateVueReadme(projectPath, config) {
  const packageManager = config.packageManager || 'npm';
  const installCmd = packageManager === 'npm' ? 'npm install' : `${packageManager} install`;
  const runCmd = packageManager === 'npm' ? 'npm run' : packageManager;

  const readme = `# ${config.projectName}

A Vue 3 + Vite project created with InitKit CLI.

## 🚀 Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Pinia** - Intuitive, type safe store for Vue${config.language === 'typescript' ? '\n- **TypeScript** - Type-safe JavaScript' : ''}${config.styling === 'tailwind' ? '\n- **Tailwind CSS** - Utility-first CSS framework' : ''}

## 📦 Installation

\`\`\`bash
${installCmd}
\`\`\`

## 🏃 Development

\`\`\`bash
${runCmd} dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build

\`\`\`bash
${runCmd} build
\`\`\`

## 🔍 Lint & Format

\`\`\`bash
# Lint
${runCmd} lint

# Format
${runCmd} format
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── assets/          # Static assets (images, styles)
├── components/      # Reusable Vue components
├── composables/     # Composition API composables
├── router/          # Vue Router configuration
├── stores/          # Pinia stores
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── views/           # Page components
├── App.vue          # Root component
└── main.${config.language === 'typescript' ? 'ts' : 'js'}           # Application entry point
\`\`\`

## 🎯 Next Steps

1. **Configure routing**: Edit \`src/router/index.${config.language === 'typescript' ? 'ts' : 'js'}\` to add your routes
2. **Add components**: Create reusable components in \`src/components/\`
3. **Manage state**: Use Pinia stores in \`src/stores/\` for global state
4. **Create pages**: Add new views in \`src/views/\`
5. **Add utilities**: Place helper functions in \`src/utils/\`

## 📚 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)${config.styling === 'tailwind' ? '\n- [Tailwind CSS Documentation](https://tailwindcss.com/)' : ''}

---

Built with ❤️ using InitKit
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

async function generateBarrelExport(filePath, featureName) {
  const content = `/**
 * Barrel export for ${featureName}
 * 
 * TODO: Export your components, composables, and types here
 * 
 * Example:
 * export { default as ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Component } from './components/${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Component.vue'
 * export { use${featureName.charAt(0).toUpperCase() + featureName.slice(1)} } from './composables/use${featureName.charAt(0).toUpperCase() + featureName.slice(1)}'
 * export type { ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}State } from './types'
 */

export {}
`;

  await fs.writeFile(filePath, content);
}

export { generateVueTemplate };
