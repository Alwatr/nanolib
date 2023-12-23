const {context, build} = require('esbuild');
const {resolve} = require('path');
const {existsSync} = require('fs');

const packageJsonPath = resolve(process.cwd(), 'package.json');
if (existsSync(packageJsonPath) === false) {
  console.error('package.json not found', {path: packageJsonPath});
  process.exit(1);
}
const packageJson = require(packageJsonPath);

console.log('🚀 nano-build');
console.log('📦 ' + packageJson.name);

const watchMode = process.argv.includes('--watch');

const devMode = process.env.NODE_ENV !== 'production';

/**
 * @type {import('esbuild').BuildOptions}
 */
const defaultOptions = {
  entryPoints: ['src/main.ts'],
  outdir: 'dist',
  logLevel: 'info',
  platform: 'node',
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
  default: defaultOptions,
  module: {
    format: 'esm',
    cjs: true,
    mangleProps: '_$',
    packages: 'external',
  },
  pwa: {
    format: 'iife',
    platform: 'browser',
    target: 'es2017',
    mangleProps: '_$',
    treeShaking: true,
    sourcemap: false,
    sourcesContent: false,
  },
  pmpa: {
    entryPoints: ['site/_ts/*.ts'],
    outdir: 'dist/es',
    format: 'iife',
    platform: 'browser',
    target: 'es2017',
    mangleProps: '_$',
    treeShaking: true,
    sourcemap: false,
    sourcesContent: false,
  },
};

function getOptions() {
  let presetName = process.argv.find((arg) => arg.startsWith('--preset='))?.split('=')[1] ?? 'default';
  console.log('preset: %s', presetName);
  const presetOptions = presetRecord[presetName];
  if (presetOptions) {
    console.error('preset not found', {preset: presetName});
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

  console.log('options: %o', options);

  if (typeof options.mangleProps === 'string') {
    options.mangleProps = new RegExp(options.mangleProps);
  }

  return options;
}

async function build(options) {
  const alsoCjs = options.format === 'esm' && options.cjs;
  delete options.cjs;

  if (alsoCjs) {
    options.outExtension = {
      ...options.outExtension,
      '.js': '.mjs',
    };
  }

  if (watchMode) {
    console.log('👀 Watching...');
    const esbuildContext = await context(options);
    esbuildContext.watch();
    return;
  }

  // else
  console.log('🛠️ Building...');
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

build(getOptions());
