import https from 'https';

/**
 * Fetch the latest version of a package from npm registry
 * @param {string} packageName - Name of the npm package
 * @returns {Promise<string>} Latest version number
 */
export async function getLatestVersion(packageName) {
  return new Promise((resolve) => {
    const url = `https://registry.npmjs.org/${packageName}/latest`;

    https
      .get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json.version || 'latest');
          } catch (_error) {
            // If parsing fails, return 'latest' as fallback
            resolve('latest');
          }
        });
      })
      .on('error', () => {
        // On network error, return 'latest' as fallback
        console.warn(`Warning: Could not fetch version for ${packageName}, using 'latest'`);
        resolve('latest');
      });
  });
}

/**
 * Fetch latest versions for multiple packages
 * @param {Object} packages - Object with package names as keys
 * @returns {Promise<Object>} Object with package names as keys and latest versions as values
 */
export async function getLatestVersions(packages) {
  const packageNames = Object.keys(packages);
  const versions = {};

  await Promise.all(
    packageNames.map(async (name) => {
      try {
        const version = await getLatestVersion(name);
        versions[name] = `^${version}`;
      } catch (error) {
        versions[name] = 'latest';
      }
    })
  );

  return versions;
}

/**
 * Get latest versions for common dependencies
 * @returns {Promise<Object>} Object with latest versions
 */
export async function getLatestDependencies() {
  const commonPackages = {
    // React ecosystem
    react: null,
    'react-dom': null,
    '@types/react': null,
    '@types/react-dom': null,
    '@vitejs/plugin-react': null,
    vite: null,
    typescript: null,

    // Next.js
    next: null,
    '@types/node': null,

    // Vue
    vue: null,
    '@vitejs/plugin-vue': null,
    'vue-tsc': null,
    'vue-router': null,
    pinia: null,

    // State Management
    '@reduxjs/toolkit': null,
    'react-redux': null,
    zustand: null,
    jotai: null,

    // Routing
    'react-router-dom': null,

    // Data Fetching
    '@tanstack/react-query': null,
    '@tanstack/vue-query': null,

    // Forms
    'react-hook-form': null,
    '@hookform/resolvers': null,

    // Validation
    zod: null,

    // HTTP
    axios: null,

    // UI
    'framer-motion': null,
    'react-icons': null,
    '@radix-ui/react-dialog': null,
    '@radix-ui/react-dropdown-menu': null,
    '@radix-ui/react-select': null,
    '@radix-ui/react-slot': null,

    // Styling
    tailwindcss: null,

    // Utils
    'date-fns': null,
    lodash: null,
    '@vueuse/core': null,
  };

  return await getLatestVersions(commonPackages);
}
