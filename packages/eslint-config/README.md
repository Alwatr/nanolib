# ESLint Configurations

Alwatr ECMAScript Style Guide as a ESLint [shareable configurations](http://eslint.org/docs/developer-guide/shareable-configs.html).

## Installation

```bash
yarn add -D @alwatr/eslint-config \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-import \
  eslint-import-resolver-typescript
```

## Usage

Create a `.eslintrc.json` file in the root of your project:

```json
{
  "extends": "@alwatr/eslint-config",
  "rules": {
    // Additional, per-project rules...
  }
}
```

## Sponsors

The following companies, organizations, and individuals support Nitrobase ongoing maintenance and development. Become a Sponsor to get your logo on our README and website.

[![Exir Studio](https://avatars.githubusercontent.com/u/181194967?s=200&v=4)](https://exirstudio.com)

### Contributing

Contributions are welcome! Please read our [contribution guidelines](https://github.com/Alwatr/.github/blob/next/CONTRIBUTING.md) before submitting a pull request.

### License

This project is licensed under the [AGPL-3.0 License](LICENSE).
