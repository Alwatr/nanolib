# Alwatr TypeScript Config

This is a base TypeScript configuration for Alwatr projects.

## installation

```bash
yarn add -D @alwatr/tsconfig-base
```

## Usage

Create a `tsconfig.json` file in the root of your project:

```json
{
  "extends": "@alwatr/tsconfig-base",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"]
}
```
