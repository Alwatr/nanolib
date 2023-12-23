# Nano build

Build/bundle tools for ECMAScript, TypeScript, and JavaScript libraries. It's easy to use, doesn't require any setup, and adheres to best practices. It has no dependencies and uses esbuild for enhanced performance.

## Installation

```bash
yarn add -D @alwatr/nano-build
```

## Usage

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "nano-build --preset=module",
    "watch": "yarn run build --watch",
    "clean": "rm -rfv dist .tsbuildinfo"
  }
}
```

## Presets

### default

```js
{
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
    js: "/* @package_name v@package_version */"
  },
  define: {
    __package_version: `'@package_version'`,
  },
}
```

### `--preset=module`

```js
{
  ...defaultPreset,
  format: 'esm',
  cjs: true,
  mangleProps: '_$',
  packages: 'external',
}
```

### `--preset=pwa`

```js
{
  ...defaultPreset,
  format: 'iife',
  platform: 'browser',
  target: 'es2017',
  mangleProps: '_$',
  treeShaking: true,
  sourcemap: false,
  sourcesContent: false,
}
```

### `--preset=pmpa`

```js
{
  ...defaultPreset,
  entryPoints: ['site/_ts/*.ts'],
  outdir: 'dist/es',
  format: 'iife',
  platform: 'browser',
  target: 'es2017',
  mangleProps: '_$',
  treeShaking: true,
  sourcemap: false,
  sourcesContent: false,
}
```

## Configuration

Add 'nano-build' field to your `package.json` for overwriting configuration:

```json
{
  "nano-build": {
    "bundle": true
  },
  "nano-build-development": {
    "minify": false,
    "sourcemap": true
  },
  "nano-build-production": {
    "minify": true,
    "sourcemap": false
  }
}
```
