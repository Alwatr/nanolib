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
    "build": "nano-build",
    "watch": "nano-build --watch",
    "clean": "rm -rfv dist .tsbuildinfo"
  }
}
```

## Configuration

Add 'nano-build' field to your `package.json`:

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

default configuration:

```json
{
  "entryPoints": ["src/main.ts"],
  "outdir": "dist",
  "logLevel": "info",
  "platform": "node",
  "target": "es2020",
  "format": "esm",
  "cjs": true,
  "minify": true,
  "mangleProps": "_$",
  "treeShaking": false,
  "sourcemap": true,
  "sourcesContent": true,
  "bundle": true,
  "packages": "external",
  "splitting": false,
  "charset": "utf8",
  "legalComments": "none",
  "banner": {
    "js": "/* @package_name v@package_version */"
  },
  "define": {
    "__package_version": "'@package_version'"
  }
}
```
