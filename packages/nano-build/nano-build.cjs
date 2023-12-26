const {context, build} = require('esbuild');
const {resolve} = require('path');
const {existsSync} = require('fs');

const packageJsonPath = resolve(process.cwd(), 'package.json');
if (existsSync(packageJsonPath) === false) {
  console.error('❌ package.json not found', {path: packageJsonPath});
  process.exit(1);
}
const packageJson = require(packageJsonPath);

console.log('🚀 nano-build');
console.log('📦 %s\n', packageJson.name);

const watchMode = process.argv.includes('--watch');

const devMode = process.env.NODE_ENV !== 'production';

/**
 * @type {import('esbuild').BuildOptions}
 */
const defaultOptions = {
  entryPoints: ['src/main.ts'],
  outdir: 'dist',
  logLevel: 'info',
  target: 'es2020',
  minify: true,
  treeShaking: false,
  sourcemap: true,
  sourcesContent: true,
  bundle: true,
  splitting: false,
  charset: 'utf8',
  legalComments: 'none',
  banner: {
    js: '/* ' + packageJson.name + ' v' + packageJson.version + ' */',
  },
  define: {
    __package_version: `'${packageJson.version}'`,
  },
};

const presetRecord = {
  default: {},
  module: {
    platform: 'node',
    format: 'esm',
    cjs: true,
    mangleProps: '__$',
    packages: 'external',
  },
  pwa: {
    platform: 'browser',
    format: 'iife',
    mangleProps: '_$',
    treeShaking: true,
    sourcemap: false,
    sourcesContent: false,
    target: [
      'es2018',
      'chrome62',
      'edge79',
      'firefox78',
      'safari11',
    ],
  },
  pmpa: {
    entryPoints: ['site/_ts/*.ts'],
    outdir: 'dist/es',
    platform: 'browser',
    format: 'iife',
    mangleProps: '_$',
    treeShaking: true,
    sourcemap: false,
    sourcesContent: false,
    target: [
      'es2018',
      'chrome62',
      'edge79',
      'firefox78',
      'safari11',
    ],
  },
  microservice: {
    platform: 'node',
    format: 'esm',
    treeShaking: true,
    mangleProps: '.*',
    sourcemap: false,
    sourcesContent: false,
    target: 'node20',
  },
};

function getOptions() {
  let presetName = process.argv.find((arg) => arg.startsWith('--preset='))?.split('=')[1] ?? 'default';
  console.log('🔧 preset: %s', presetName);
  const presetOptions = presetRecord[presetName];
  if (!presetOptions) {
    console.error('❌ preset not found', {preset: presetName});
    process.exit(1);
  }

  const options = {
    ...defaultOptions,
    ...presetOptions,
    ...packageJson['nano-build'],
    ...packageJson['nano-build-' + (devMode ? 'development' : 'production')],
  };

  // Remove null fields from esbuildOptions
  Object.keys(options).forEach((key) => {
    if (options[key] === null) {
      delete options[key];
    }
  });

  console.log('🛠️  options: %o\n', options);

  if (typeof options.mangleProps === 'string') {
    options.mangleProps = new RegExp(options.mangleProps);
  }

  return options;
}

/**
 * Nano build process.
 * @param {import('esbuild').BuildOptions} options
 */
async function nanoBuild(options) {
  const alsoCjs = options.format === 'esm' && options.cjs;
  delete options.cjs;

  if (options.format === 'esm' || options.format === 'cjs') {
    options.outExtension = {
      '.js': options.format === 'esm' ? '.mjs' : '.cjs',
      ...options.outExtension,
    };
  }

  if (watchMode) {
    console.log('👀 Watching...');
    const esbuildContext = await context(options);
    esbuildContext.watch();
    return;
  }

  // else
  console.log('🛠️  Building...');
  await build(options);
  if (alsoCjs) {
    await build({
      ...options,
      format: 'cjs',
      outExtension: {
        ...options.outExtension,
        '.js': '.cjs',
      },
    });
  }
}

nanoBuild(getOptions());
