# Nano build

Build/bundle tools for ECMAScript, TypeScript, and JavaScript libraries. It's easy to use, doesn't require any setup, and adheres to best practices. It has no dependencies and uses Bun's built-in bundler for enhanced performance.

## Requirements

This package requires [Bun](https://bun.sh) as the runtime — it uses `Bun.build()` directly.

## Installation

First, install `@alwatr/nano-build` as a development dependency:

```bash
bun add -D @alwatr/nano-build
```

## Usage

Add the following scripts to your `package.json` to use `@alwatr/nano-build`:

```json
{
  "scripts": {
    "build": "nano-build --preset=module",
    "watch": "bun run build --watch"
  }
}
```

Then run the following command to build your project:

```bash
bun run build
```

## Configuration

### TypeScript types

```ts
import type {} from '@alwatr/nano-build';
```

### Overwriting configuration

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

## Presets

Presets are predefined configurations that can be used to build your project. You can use the `--preset` flag to specify a preset.

```bash
bun run build --preset=module
```

### default

```js
{
  entryPoints: ['src/*.ts'],
  outdir: 'dist',
  bundle: true,
  minify: true,
  minifyWhitespace: true,
  treeShaking: true,
  sourcemap: false,
  define: {
    __package_name__: packageJson.name,
    __package_version__: packageJson.version,
    __dev_mode__: process.env.NODE_ENV !== 'production',
  },
}
```

### `--preset=module`

Builds and bundle for single export module.

```js
{
  ...defaultPreset,
  entryPoints: ['src/main.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  minify: false,
  cjs: true,
  packages: 'external',
  sourcemap: true,
}
```

Note: default production overwrite options not applied.

### `--preset=module2`

Builds and bundles multiple entry points in root of `src` directory for multiple exports module.

```js
{
  ...defaultPreset,
  entryPoints: ['src/*.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  minify: false,
  cjs: true,
  packages: 'external',
  sourcemap: true,
}
```

Note: default production overwrite options not applied.

### `--preset=module3`

Builds multiple entry points in `src` directory for multiple exports module without bundling.

```js
{
  ...defaultPreset,
  entryPoints: ['src/**/*.ts'],
  bundle: false,
  platform: 'node',
  format: 'esm',
  minify: false,
  cjs: true,
  packages: 'external',
  sourcemap: true,
}
```

Note: `bundle: false` is not natively supported by Bun's bundler (which always bundles). All dependencies are treated as external instead, which achieves a similar result for library builds.

Note: default production overwrite options not applied.

### `--preset=pwa`

```js
{
  ...defaultPreset,
  entryPoints: ['src/*.ts'],
  platform: 'browser',
  format: 'iife',
  ...(devMode ? developmentOverwriteOptions : productionOverwriteOptions),
}
```

### `--preset=weaver`

```js
{
  ...defaultPreset,
  entryPoints: ['src/ts/*.ts'],
  outdir: 'dist/es',
  platform: 'browser',
  format: 'iife',
  ...(devMode ? developmentOverwriteOptions : productionOverwriteOptions),
}
```

### `--preset=microservice`

```js
{
  ...defaultPreset,
  entryPoints: ['src/main.ts'],
  platform: 'node',
  format: 'esm',
  ...(devMode ? developmentOverwriteOptions : productionOverwriteOptions),
}
```

### `--preset=pmpa`

```js
{
  ...defaultPreset,
  entryPoints: ['site/_ts/*.ts'],
  outdir: 'dist/es',
  platform: 'browser',
  format: 'iife',
  ...(devMode ? developmentOverwriteOptions : productionOverwriteOptions),
}
```

### Development overwrite

This preset is used when `NODE_ENV` is not set to `production`. It overwrites all other presets.

```js
{
  sourcemap: true,
}
```

you can also add `nano-build-development` field to your `package.json` for overwriting configuration.

### Production overwrite

This preset is used when `NODE_ENV` is set to `production`. It overwrites all other presets.

```js
{}
```

you can also add `nano-build-production` field to your `package.json` for overwriting configuration.

## Migration notes from esbuild

This package migrated from [esbuild](https://esbuild.github.io/) to [Bun's built-in bundler](https://bun.sh/docs/bundler). The preset configuration API remains backward-compatible. Key behavioral differences:

| Feature | esbuild | Bun bundler |
|---|---|---|
| `target` (ES version) | Syntax downleveling | **Not supported** — ignored |
| `mangleProps` | Property mangling | **Not supported** — ignored |
| `dropLabels` | Dead-code label elimination | **Not supported** — ignored |
| `legalComments` | Legal comment handling | **Not supported** — ignored |
| `banner` | JS banner comment (`{js: string}`) | Converted to Bun's plain `string` format |
| `charset` | Output charset | **Not supported** — ignored |
| `bundle: false` | Transpile-only mode | **Not supported** — external deps used instead |
| `packages: 'external'` | Auto-externalize packages | Passed through natively (Bun 1.3.10+) |
| `sourcesContent` | Inline sources in sourcemaps | **Not supported** — ignored |
| `treeShaking` | Configurable | Always enabled |
| Watch mode | `context.watch()` API | `fs.watch`-based rebuild |

## Sponsors

The following companies, organizations, and individuals support Nanolib ongoing maintenance and development. Become a Sponsor to get your logo on our README and website.

### Contributing

Contributions are welcome! Please read our [contribution guidelines](https://github.com/Alwatr/.github/blob/next/CONTRIBUTING.md) before submitting a pull request.
