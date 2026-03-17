#!/usr/bin/env bun

const pc = require('picocolors');

/**
 * @typedef {import('@alwatr/type-helper')}
 * @typedef {Object} BuildOptions
 * @property {string[]} [entryPoints]
 * @property {string} [outdir]
 * @property {string} [outfile]
 * @property {boolean} [bundle]
 * @property {boolean} [minify]
 * @property {boolean} [minifyWhitespace]
 * @property {boolean} [minifyIdentifiers]
 * @property {boolean} [minifySyntax]
 * @property {string} [platform]
 * @property {string|string[]} [target]
 * @property {string} [format]
 * @property {string[]} [external]
 * @property {string} [packages]
 * @property {boolean|string} [sourcemap]
 * @property {boolean} [sourcesContent]
 * @property {string} [charset]
 * @property {string} [logLevel]
 * @property {string} [legalComments]
 * @property {Object} [banner]
 * @property {Object} [define]
 * @property {boolean} [treeShaking]
 * @property {boolean} [splitting]
 * @property {string} [publicPath]
 * @property {boolean} [cjs]
 * @property {string|RegExp} [mangleProps]
 * @property {string[]} [dropLabels]
 * @property {Object} [outExtension]
 * @property {Object[]} [plugins]
 */

const {resolve} = require('path');
const {existsSync, watch} = require('fs');

/** Regex matching source file extensions that should trigger a rebuild in watch mode. */
const watchFileRe = /\.(ts|tsx|js|jsx|mts|cts|mjs|cjs)$/;

const logger = {
  banner: (/** @type {string} */ message, /** @type {unknown[]} */ ...args) => console.log(pc.cyan(pc.bold(`${message}`)), ...args),
  info: (/** @type {string} */ message, /** @type {unknown[]} */ ...args) => console.log(pc.bgCyan(`[i] ${message} `), ...args),
  success: (/** @type {string} */ message, /** @type {unknown[]} */ ...args) => console.log(pc.bgGreen(`[✓] ${message} `), ...args),
  error: (/** @type {string} */ message, /** @type {unknown[]} */ ...args) => console.error(pc.bgRed(`[x] ${message} `), ...args),
  warn: (/** @type {string} */ message, /** @type {unknown[]} */ ...args) => console.warn(pc.bgYellow(`[!] ${message} `), ...args),
  log: console.log,
};

const packageJsonPath = resolve(process.cwd(), 'package.json');
if (existsSync(packageJsonPath) === false) {
  logger.error('`package.json` not found in `%s`', packageJsonPath);
  process.exit(1);
}
const packageJson = require(packageJsonPath);

logger.banner('\n🚀 Alwatr NanoBuild\n');
logger.banner('📦 %s v%s\n', packageJson.name, packageJson.version);

const devMode = process.env.NODE_ENV !== 'production';

logger.info(`${devMode ? 'Development' : 'Production'} mode`);

const watchMode = process.argv.includes('--watch');
if (watchMode) {
  logger.info('Watch mode enabled');
}

/**
 * @type {BuildOptions}
 */
const defaultOptions = {
  entryPoints: ['src/*.ts'],
  outdir: 'dist',
  bundle: true,
  minify: true,
  minifyWhitespace: true,
  treeShaking: true,
  sourcemap: false,
  sourcesContent: false,
  charset: 'utf8',
  legalComments: 'linked',
  banner: {
    js: `/** 📦 ${packageJson.name} v${packageJson.version} */`,
  },
  define: {
    __package_name__: `'${packageJson.name}'`,
    __package_version__: `'${packageJson.version}'`,
    __dev_mode__: devMode.toString(),
  },
};

/**
 * @type {BuildOptions}
 */
const developmentOptions = {
  sourcemap: true,
  sourcesContent: true,
};

/**
 * @type {BuildOptions}
 */
const productionOptions = {
  dropLabels: ['__dev_mode__'],
};

/**
 * @type {DictionaryOpt<BuildOptions>}
 */
const presetRecord = {
  default: {},
  module: {
    entryPoints: ['src/main.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    minify: false,
    cjs: true,
    packages: 'external',
    sourcemap: true,
    sourcesContent: true,
  },
  module2: {
    entryPoints: ['src/*.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    minify: false,
    cjs: true,
    packages: 'external',
    sourcemap: true,
    sourcesContent: true,
  },
  module3: {
    entryPoints: ['src/**/*.ts'],
    bundle: false,
    platform: 'node',
    format: 'esm',
    minify: false,
    cjs: true,
    packages: 'external',
    sourcemap: true,
    sourcesContent: true,
  },
  pwa: {
    entryPoints: ['src/*.ts'],
    platform: 'browser',
    format: 'iife',
    mangleProps: '_$',
    target: ['chrome109', 'firefox115', 'safari15.6', 'ios15.8'],
    ...(devMode ? developmentOptions : productionOptions),
  },
  pmpa: {
    entryPoints: ['site/_ts/*.ts'],
    outdir: 'dist/es',
    platform: 'browser',
    format: 'iife',
    mangleProps: '_$',
    target: ['chrome109', 'firefox115', 'safari15.6', 'ios15.8'],
    ...(devMode ? developmentOptions : productionOptions),
  },
  weaver: {
    entryPoints: ['src/ts/*.ts'],
    outdir: 'dist/es',
    platform: 'browser',
    format: 'iife',
    mangleProps: '_$',
    target: ['chrome109', 'firefox115', 'safari15.6', 'ios15.8'],
    ...(devMode ? developmentOptions : productionOptions),
  },
  microservice: {
    entryPoints: ['src/main.ts'],
    platform: 'node',
    format: 'esm',
    mangleProps: '_$',
    target: 'node22',
    ...(devMode ? developmentOptions : productionOptions),
  },
};

function getOptions() {
  const presetName = process.argv.find((arg) => arg.startsWith('--preset='))?.split('=')[1] ?? 'default';
  logger.info('Preset: `%s`', presetName);
  if (!Object.hasOwn(presetRecord, presetName)) {
    logger.error('Preset `%s` not found', presetName);
    process.exit(1);
  }

  const presetOptions = presetRecord[presetName];

  const options = {
    ...defaultOptions,
    ...presetOptions,
    ...packageJson['nano-build'],
    ...(devMode ? packageJson['nano-build-development'] : packageJson['nano-build-production']),
  };

  // Remove null fields from options
  Object.keys(options).forEach((key) => {
    if (options[key] === null) {
      delete options[key];
    }
  });

  logger.info('Options:', options);

  if (typeof options.mangleProps === 'string') {
    options.mangleProps = new RegExp(options.mangleProps);
  }

  return options;
}

/**
 * Expand glob patterns in entryPoints to actual file paths using Bun.Glob.
 * @param {string[]} patterns
 * @returns {Promise<string[]>}
 */
async function expandEntryPoints(patterns) {
  const result = [];
  for (const pattern of patterns) {
    if (pattern.includes('*') || pattern.includes('?') || pattern.includes('{')) {
      const glob = new Bun.Glob(pattern);
      const files = [];
      for await (const file of glob.scan({cwd: process.cwd(), onlyFiles: true})) {
        files.push(file);
      }
      result.push(...files.sort());
    } else {
      result.push(pattern);
    }
  }
  return result;
}

/**
 * Determine directories to watch from entry point patterns (before glob expansion).
 * @param {string[]} patterns
 * @returns {string[]}
 */
function getWatchDirs(patterns) {
  return patterns.map((pattern) => {
    const segments = pattern.split('/');
    const firstGlobIdx = segments.findIndex((s) => s.includes('*') || s.includes('?') || s.includes('{'));
    const dirSegments = firstGlobIdx === -1 ? segments.slice(0, -1) : segments.slice(0, firstGlobIdx);
    return resolve(process.cwd(), dirSegments.join('/') || '.');
  });
}

/**
 * Convert esbuild-style BuildOptions to Bun.build() BuildConfig.
 * @param {BuildOptions} options
 * @returns {Promise<import('bun').BuildConfig>}
 */
async function toBunBuildConfig(options) {
  /** @type {import('bun').BuildConfig} */
  const bun = {};

  // Disable Bun's default throw-on-failure so we can inspect result.logs
  bun.throw = false;

  // entryPoints → entrypoints (expand glob patterns)
  bun.entrypoints = await expandEntryPoints(options.entryPoints ?? defaultOptions.entryPoints ?? []);

  // outdir (same); note: outfile is only supported in Bun's compile mode
  if (options.outdir) bun.outdir = options.outdir;

  // platform → target ('node' | 'browser' | 'bun')
  if (options.platform) {
    bun.target = /** @type {any} */ (options.platform);
  }

  // format (same values: 'esm' | 'cjs' | 'iife')
  if (options.format) bun.format = /** @type {any} */ (options.format);

  // minify: combine boolean + individual flags into Bun's minify object
  const hasSeparateMinifyFlags =
    options.minifyWhitespace !== undefined || options.minifyIdentifiers !== undefined || options.minifySyntax !== undefined;
  if (!hasSeparateMinifyFlags) {
    if (options.minify !== undefined) bun.minify = options.minify;
  } else {
    /** @type {{whitespace?: boolean, identifiers?: boolean, syntax?: boolean}} */
    const m = {};
    if (options.minify === true) {
      m.whitespace = true;
      m.identifiers = true;
      m.syntax = true;
    }
    if (options.minifyWhitespace !== undefined) m.whitespace = options.minifyWhitespace;
    if (options.minifyIdentifiers !== undefined) m.identifiers = options.minifyIdentifiers;
    if (options.minifySyntax !== undefined) m.syntax = options.minifySyntax;
    if (Object.keys(m).length > 0) bun.minify = m;
    else if (options.minify === false) bun.minify = false;
  }

  // sourcemap: esbuild `true` means 'external'; Bun `true` means 'inline' — convert explicitly
  if (options.sourcemap === true) bun.sourcemap = 'external';
  else if (options.sourcemap === false) bun.sourcemap = 'none';
  else if (options.sourcemap) bun.sourcemap = /** @type {any} */ (options.sourcemap);

  // define (same)
  if (options.define) bun.define = options.define;

  // external (same)
  if (options.external && options.external.length > 0) bun.external = options.external;

  // packages: 'external' | 'bundle' — Bun supports this natively
  if (options.packages) bun.packages = /** @type {any} */ (options.packages);

  // banner: esbuild uses {js: string}; Bun uses a plain string
  if (options.banner && options.banner.js) bun.banner = options.banner.js;

  // splitting, publicPath, plugins (same)
  if (options.splitting !== undefined) bun.splitting = options.splitting;
  if (options.publicPath !== undefined) bun.publicPath = options.publicPath;
  if (options.plugins) bun.plugins = /** @type {any} */ (options.plugins);

  // Warn about unsupported options that affect output behaviour
  if (options.mangleProps) {
    logger.warn('`mangleProps` is not supported by Bun bundler and will be ignored.');
  }
  if (options.dropLabels) {
    logger.warn('`dropLabels` is not supported by Bun bundler. Dead-code elimination for labels will be skipped.');
  }
  if (
    options.target &&
    (Array.isArray(options.target) ||
      /^(es\d+|node\d+|chrome|firefox|safari|ios|edge)/.test(String(options.target)))
  ) {
    logger.warn('`target` (syntax downleveling) is not supported by Bun bundler and will be ignored.');
  }
  if (options.bundle === false) {
    logger.warn('`bundle: false` is not supported by Bun bundler. Marking all packages as external instead.');
    bun.packages = 'external';
  }
  // Silently drop: logLevel, charset, legalComments, sourcesContent, treeShaking, outExtension

  return bun;
}

/**
 * Execute Bun.build() and handle errors/warnings from the result.
 * @param {import('bun').BuildConfig} bunConfig
 */
async function runBunBuild(bunConfig) {
  const result = await Bun.build(bunConfig);
  for (const msg of result.logs) {
    if (msg.level === 'error') {
      logger.error(msg.message);
    } else {
      logger.warn(msg.message);
    }
  }
  if (!result.success) {
    process.exit(1);
  }
}

/**
 * Nano build process.
 * @param {BuildOptions} options
 */
async function nanoBuild(options) {
  const alsoCjs = options.format === 'esm' && options.cjs;
  delete options.cjs;

  const bunConfig = await toBunBuildConfig(options);

  // Set output file extension via Bun's naming option (replaces esbuild's outExtension)
  if (options.format === 'esm') {
    bunConfig.naming = {entry: '[dir]/[name].mjs'};
  } else if (options.format === 'cjs') {
    bunConfig.naming = {entry: '[dir]/[name].cjs'};
  }

  if (watchMode) {
    logger.info('Watching for changes...');
    await startWatchMode(bunConfig, alsoCjs, options.entryPoints || defaultOptions.entryPoints || []);
    return;
  }

  // else
  logger.info('Building...');
  await runBunBuild(bunConfig);
  if (alsoCjs) {
    logger.info('Building CJS bundle...');
    await runBunBuild({
      ...bunConfig,
      format: 'cjs',
      naming: {entry: '[dir]/[name].cjs'},
    });
  }
  logger.success('Build complete.');
}

/**
 * Start watch mode: do an initial build then rebuild on source file changes.
 * @param {import('bun').BuildConfig} bunConfig
 * @param {boolean} alsoCjs
 * @param {string[]} entryPatterns - original (pre-glob) entry point patterns for watch dir detection
 */
async function startWatchMode(bunConfig, alsoCjs, entryPatterns) {
  let rebuilding = false;
  let pendingRebuild = false;

  const doRebuild = async () => {
    logger.info('Rebuilding...');
    try {
      await runBunBuild(bunConfig);
      if (alsoCjs) {
        await runBunBuild({
          ...bunConfig,
          format: 'cjs',
          naming: {entry: '[dir]/[name].cjs'},
        });
      }
      logger.success('Rebuild complete.');
    } catch (/** @type {any} */ err) {
      logger.error('Rebuild failed:', err?.message ?? err);
    }
  };

  const triggerRebuild = async () => {
    if (rebuilding) {
      pendingRebuild = true;
      return;
    }
    rebuilding = true;
    await doRebuild();
    rebuilding = false;
    if (pendingRebuild) {
      pendingRebuild = false;
      triggerRebuild();
    }
  };

  // Initial build
  await doRebuild();

  // Watch source directories derived from entry patterns
  const watchDirs = getWatchDirs(entryPatterns);
  const uniqueDirs = [...new Set(watchDirs)];
  for (const dir of uniqueDirs) {
    if (existsSync(dir)) {
      watch(dir, {recursive: true}, (_event, filename) => {
        if (filename && watchFileRe.test(filename)) {
          triggerRebuild();
        }
      });
      logger.info('Watching:', dir);
    }
  }

  logger.success('Watching for file changes.');
}

nanoBuild(getOptions());
