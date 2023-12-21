const {context, build} = require('esbuild');
const {resolve} = require('path');
const packageJsonPath = resolve(process.cwd(), 'package.json');
const packageJson = require(packageJsonPath);

console.log('🚀 nano-build');
console.log('📦 ' + packageJson.name);

const watchMode = process.argv.includes('--watch');

const devMode = process.env.NODE_ENV !== 'production';

(async () => {
  /**
   * @type {import('esbuild').BuildOptions}
   */
  const esbuildOptions = {
    entryPoints: ['src/main.ts'],
    outdir: 'dist',
    logLevel: 'info',
    platform: 'node',
    target: 'es2020',
    format: 'esm',
    cjs: true,
    minify: true,
    mangleProps: '_$',
    treeShaking: false,
    sourcemap: true,
    sourcesContent: true,
    bundle: true,
    packages: 'external',
    splitting: false,
    charset: 'utf8',
    legalComments: 'none',
    banner: {
      js: '/* ' + packageJson.name + ' v' + packageJson.version + ' */',
    },
    define: {
      __package_version: `'${packageJson.version}'`,
    },
    ...packageJson['nano-build'],
    ...packageJson['nano-build-' + (devMode ? 'development' : 'production')],
  };

  const alsoCjs = esbuildOptions.format === 'esm' && esbuildOptions.cjs;
  delete esbuildOptions.cjs;

  if (alsoCjs) {
    esbuildOptions.outExtension = {
      ...esbuildOptions.outExtension,
      '.js': '.mjs',
    };
  }

  // Remove null fields from esbuildOptions
  Object.keys(esbuildOptions).forEach((key) => {
    if (esbuildOptions[key] === null) {
      delete esbuildOptions[key];
    }
  });

  if (esbuildOptions.outdir !== undefined) {
    delete esbuildOptions.outfile;
  }

  console.log('esbuildOptions: %o', esbuildOptions);

  esbuildOptions.mangleProps = new RegExp(esbuildOptions.mangleProps);

  if (watchMode) {
    console.log('👀 Watching...');
    const esbuildContext = await context(esbuildOptions);
    esbuildContext.watch();
    return;
  }

  // else
  console.log('🛠️ Building...');
  await build(esbuildOptions);
  if (alsoCjs) {
    await build({
      ...esbuildOptions,
      format: 'cjs',
      outExtension: {
        ...esbuildOptions.outExtension,
        '.js': '.cjs',
      },
    });
  }
})();
