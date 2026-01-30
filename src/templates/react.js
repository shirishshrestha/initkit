import fs from 'fs-extra';
import path from 'path';

/**
 * Generate React + Vite project structure (folders only)
 * Vite creates all config files automatically
 */
export async function generateReactTemplate(projectPath, config) {
  // Create folder structure only
  await createReactFolderStructure(projectPath, config);

  // Generate package.json
  await generateReactPackageJson(projectPath, config);

  // Generate README
  await generateReactReadme(projectPath, config);
}

async function createReactFolderStructure(projectPath, config) {
  const srcPath = path.join(projectPath, 'src');
  const folderStructure = config.folderStructure || 'feature-based';

  if (folderStructure === 'feature-based') {
    // Feature-based structure
    const features = ['auth', 'dashboard', 'users'];
    for (const feature of features) {
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'components'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'hooks'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'services'));
      await fs.ensureDir(path.join(srcPath, 'features', feature, 'types'));

      // Barrel export
      await fs.writeFile(
        path.join(srcPath, 'features', feature, 'index.ts'),
        generateFeatureExport(feature)
      );
    }

    // Shared directory
    await fs.ensureDir(path.join(srcPath, 'shared', 'components', 'ui'));
    await fs.ensureDir(path.join(srcPath, 'shared', 'components', 'layout'));
    await fs.ensureDir(path.join(srcPath, 'shared', 'hooks'));
    await fs.ensureDir(path.join(srcPath, 'shared', 'utils'));
    await fs.ensureDir(path.join(srcPath, 'shared', 'types'));

    await fs.writeFile(
      path.join(srcPath, 'shared', 'components', 'index.ts'),
      `// Export shared components\n// TODO: Add your shared components here\n`
    );
  } else if (folderStructure === 'component-based') {
    // Component-based structure
    await fs.ensureDir(path.join(srcPath, 'components', 'ui'));
    await fs.ensureDir(path.join(srcPath, 'components', 'layout'));
    await fs.ensureDir(path.join(srcPath, 'components', 'forms'));
    await fs.ensureDir(path.join(srcPath, 'hooks'));
    await fs.ensureDir(path.join(srcPath, 'services'));
    await fs.ensureDir(path.join(srcPath, 'utils'));
    await fs.ensureDir(path.join(srcPath, 'types'));
  } else if (folderStructure === 'atomic') {
    // Atomic design structure
    await fs.ensureDir(path.join(srcPath, 'components', 'atoms'));
    await fs.ensureDir(path.join(srcPath, 'components', 'molecules'));
    await fs.ensureDir(path.join(srcPath, 'components', 'organisms'));
    await fs.ensureDir(path.join(srcPath, 'components', 'templates'));
    await fs.ensureDir(path.join(srcPath, 'pages'));
    await fs.ensureDir(path.join(srcPath, 'hooks'));
    await fs.ensureDir(path.join(srcPath, 'services'));
  }

  // Common directories
  await fs.ensureDir(path.join(srcPath, 'routes'));
  await fs.ensureDir(path.join(srcPath, 'lib'));
  await fs.ensureDir(path.join(projectPath, 'public'));
}

async function generateReactPackageJson(projectPath, config) {
  const { language, styling, additionalLibraries = [] } = config;
  const isTypeScript = language === 'typescript';

  const dependencies = {
    react: '^18.3.1',
    'react-dom': '^18.3.1',
  };

  const devDependencies = {
    '@vitejs/plugin-react': '^4.3.4',
    vite: '^6.0.7',
    ...(isTypeScript && {
      '@types/react': '^18.3.18',
      '@types/react-dom': '^18.3.5',
      typescript: '^5.7.3',
    }),
  };

  // Add router
  if (additionalLibraries.includes('react-router')) {
    dependencies['react-router-dom'] = '^7.1.2';
  }

  // Add Tailwind v4
  if (styling === 'tailwind') {
    Object.assign(devDependencies, {
      tailwindcss: '^4.0.0',
    });
  }

  // Add libraries
  if (additionalLibraries.includes('tanstack-query')) {
    dependencies['@tanstack/react-query'] = '^5.62.15';
  }

  if (additionalLibraries.includes('zustand')) {
    dependencies['zustand'] = '^5.0.2';
  }

  if (additionalLibraries.includes('axios')) {
    dependencies['axios'] = '^1.7.9';
  }

  if (additionalLibraries.includes('zod')) {
    dependencies['zod'] = '^3.24.1';
  }

  if (additionalLibraries.includes('react-hook-form')) {
    dependencies['react-hook-form'] = '^7.54.2';
    dependencies['@hookform/resolvers'] = '^3.9.1';
  }

  const packageJson = {
    name: config.projectName,
    private: true,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: isTypeScript ? 'tsc && vite build' : 'vite build',
      preview: 'vite preview',
    },
    dependencies,
    devDependencies,
  };

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
}

async function generateReactReadme(projectPath, config) {
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

- **React 18** - UI library
- **Vite 6** - Build tool${language === 'typescript' ? '\n- **TypeScript** - Type safety' : ''}${styling === 'tailwind' ? '\n- **Tailwind CSS v4** - Styling' : ''}

## Folder Structure

\`\`\`
src/
${
  folderStructure === 'feature-based'
    ? `├── features/       # Feature modules
│   ├── auth/       # Authentication
│   ├── dashboard/  # Dashboard
│   └── users/      # Users
├── shared/         # Shared code`
    : folderStructure === 'atomic'
    ? `├── components/     # Atomic design
│   ├── atoms/      # Basic UI elements
│   ├── molecules/  # Simple components
│   ├── organisms/  # Complex components
│   └── templates/  # Page templates
├── pages/          # Page components`
    : `├── components/     # React components
│   ├── ui/         # UI components
│   └── layout/     # Layout components
├── hooks/          # Custom hooks
├── services/       # API services`
}
├── routes/         # Routing configuration
├── lib/            # Utilities
└── public/         # Static files
\`\`\`

## Next Steps

1. Run \`npm create vite@latest . -- --template react${language === 'typescript' ? '-ts' : ''}\` to initialize Vite${styling === 'tailwind' ? '\n2. Install Tailwind v4: `' + packageManager + (packageManager === 'npm' ? ' install' : ' add') + ' tailwindcss@next`' : ''}
3. Start building in \`src/features/\`
4. Add environment variables in \`.env\`

---

Built with InitKit
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

function generateFeatureExport(featureName) {
  return `// ${featureName.toUpperCase()} Feature

// TODO: Export your components
// export { ${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Component } from './components/${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Component';

// TODO: Export your hooks
// export { use${featureName.charAt(0).toUpperCase() + featureName.slice(1)} } from './hooks/use${featureName.charAt(0).toUpperCase() + featureName.slice(1)}';

// TODO: Export your services
// export * from './services/${featureName}Service';

// TODO: Export your types
// export type * from './types/${featureName}.types';
`;
}
