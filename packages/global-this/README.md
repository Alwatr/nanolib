# globalThis

Provides access to `globalThis`, ensuring cross-platform compatibility, including browsers (`window`), Node.js (`global`), and Web Workers (`self`).

## Installation

```bash
yarn add @alwatr/global-this
```

## Usage

```typescript
import {getGlobalThis} from '@alwatr/global-this';

getGlobalThis<{alwatr:{foo: string}}>().alwatr = {
 foo: 'bar',
}
```

```typescript
import {getGlobalThis} from '@alwatr/global-this';

getGlobalThis().setTimeout(() => {
  console.log(getGlobalThis<{alwatr:{foo: string}}>().alwatr.foo); // 'bar'
}, 1_000);
```

## Sponsors

The following companies, organizations, and individuals support Nanolib ongoing maintenance and development. Become a Sponsor to get your logo on our README and website.

[![Exir Studio](https://avatars.githubusercontent.com/u/181194967?s=200&v=4)](https://exirstudio.com)

### Contributing

Contributions are welcome! Please read our [contribution guidelines](https://github.com/Alwatr/.github/blob/next/CONTRIBUTING.md) before submitting a pull request.

### License

This project is licensed under the [AGPL-3.0 License](LICENSE).
