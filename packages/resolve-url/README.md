# Resolve URL

## Installation

```bash
yarn add @alwatr/resolve-url
```

## Usage

```ts
import {resolveUrl} from '@alwatr/resolve-url';

console.log(resolveUrl('/', 'ali', 'v1')); // '/ali/v1'
console.log(resolveUrl('/', '/ali/', '/v1')); // '/ali/v1'
console.log(resolveUrl('https://domain.com', 'ali', 'v1')); // 'https://domain.com/ali/v1'
```

## Sponsors

The following companies, organizations, and individuals support Nanolib ongoing maintenance and development. Become a Sponsor to get your logo on our README and website.

[![Exir Studio](https://avatars.githubusercontent.com/u/181194967?s=200&v=4)](https://exirstudio.com)

### Contributing

Contributions are welcome! Please read our [contribution guidelines](https://github.com/Alwatr/.github/blob/next/CONTRIBUTING.md) before submitting a pull request.

### License

This project is licensed under the [AGPL-3.0 License](LICENSE).
