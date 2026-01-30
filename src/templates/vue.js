import fs from 'fs-extra';
import path from 'path';

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
      await fs.writeFile(
        path.join(featurePath, 'index.ts'),
        generateBarrelExport(feature)
      );
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

  const dependencies = {
    vue: '^3.5.13',
    'vue-router': '^4.5.0',
    pinia: '^2.3.0',
  };

  const devDependencies = {
    '@vitejs/plugin-vue': '^5.2.1',
    vite: '^6.0.7',
    ...(useTypeScript && {
      typescript: '^5.7.3',
      'vue-tsc': '^2.2.0',
    }),
  };

  // Add Tailwind v4
  if (styling === 'tailwind') {
    devDependencies['tailwindcss'] = '^4.0.0';
  }

  // Add libraries
  if (additionalLibraries.includes('tanstack-query')) {
    dependencies['@tanstack/vue-query'] = '^5.62.15';
  }

  if (additionalLibraries.includes('axios')) {
    dependencies['axios'] = '^1.7.9';
  }

  if (additionalLibraries.includes('vueuse')) {
    dependencies['@vueuse/core'] = '^11.5.0';
  }

  if (additionalLibraries.includes('vee-validate')) {
    dependencies['vee-validate'] = '^4.15.0';
    dependencies['zod'] = '^3.24.1';
    dependencies['@vee-validate/zod'] = '^4.15.0';
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
${folderStructure === 'feature-based' ? `├── features/       # Feature modules
│   ├── auth/       # Authentication
│   ├── dashboard/  # Dashboard
│   └── profile/    # User profile
├── shared/         # Shared code` : `├── components/     # Vue components
│   ├── common/     # Common components
│   ├── layout/     # Layout components
│   └── forms/      # Form components`}
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
