# Nano build

Build/bundle tools for ECMAScript, TypeScript, and JavaScript libraries. It's easy to use, doesn't require any setup, and adheres to best practices. It has no dependencies and uses esbuild for enhanced performance.

## Installation

First, install `@alwatr/nano-build` as a development dependency:

```bash
yarn add -D @alwatr/nano-build
```

## Configuration

To use `@alwatr/nano-build` in your TypeScript project, you need to configure your `tsconfig.json` file.
Below is an example configuration:

```jsonc
{
  "extends": "@alwatr/tsconfig-base/tsconfig.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "emitDeclarationOnly": true,
    "composite": true,
    "types": ["@alwatr/nano-build"],
  },
  "include": ["src/**/*.ts"],
}
```

This configuration ensures that your TypeScript project is set up to use `@alwatr/nano-build` effectively, providing a streamlined build process with best practices.

## Usage

Add the following scripts to your

package.json

 to use `@alwatr/nano-build`:

```json
{
  "scripts": {
    "build": "nano-build --preset=module",
    "watch": "yarn run build --watch"
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
  target: 'es2020',
  minify: true,
  treeShaking: false,
  sourcemap: true,
  sourcesContent: true,
  bundle: true,
  splitting: false,
  charset: 'utf8',
  legalComments: 'none',
  define: {
    __package_name__: packageJson.name,
    __package_version__: packageJson.version,
    __dev_mode__: process.env.NODE_ENV !== 'production',
  },
  banner: {
    js: "/* __package_name__ v__package_version__ */"
  },
}
```

### `--preset=module`

```js
{
  ...defaultPreset,
  platform: 'node',
  format: 'esm',
  cjs: true,
  packages: 'external',
}
```

### `--preset=pwa`

```js
{
  ...defaultPreset,
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
}
```

### `--preset=microservice`

```js
{
  ...defaultPreset,
  platform: 'node',
  format: 'esm',
  treeShaking: true,
  mangleProps: '_$',
  sourcemap: false,
  sourcesContent: false,
  target: 'node20',
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
}
```

### Development overwrite

this preset is used when `NODE_ENV` is set to `development` and overwrites the all preset.

```js
{
  sourcemap: true,
  sourcesContent: true,
  dropLabels: ['__dev_mode__'],
}
```

you can also add `nano-build-development` field to your `package.json` for overwriting configuration.

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

## Sponsors

The following companies, organizations, and individuals support Nanolib ongoing maintenance and development. Become a Sponsor to get your logo on our README and website.

[![Exir Studio](https://avatars.githubusercontent.com/u/181194967?s=200&v=4)](https://exirstudio.com)

### Contributing

Contributions are welcome! Please read our [contribution guidelines](https://github.com/Alwatr/.github/blob/next/CONTRIBUTING.md) before submitting a pull request.

### License

This project is licensed under the [AGPL-3.0 License](LICENSE).
