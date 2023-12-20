# Alwatr TypeScript Config

This is a base TypeScript configuration for Alwatr projects.

## Usage

Install the package:

```bash
yarn add -D @alwatr/tsconfig-base
```

Create a `tsconfig.json` file in the root of your project:

```json
{
  "extends": "@alwatr/tsconfig-base",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "."
  },
  "include": ["src/**/*.ts"],
}
```
