# Flatomise

A utility for creating promises that can be externally resolved or rejected.

## Installation

```bash
yarn add @alwatr/flatomise
```

## Usage

```typescript
import {newFlatomise} from '@alwatr/flatomise';

const flatomise = newFlatomise();
flatomise.promise.then(() => {
  console.log('flatomise resolved');
});
flatomise.resolve();
```

For real usage, see [async-queue](https://github.com/Alwatr/nanolib/blob/next/packages/async-quque/src/main.ts).

## Sponsors

The following companies, organizations, and individuals support Nitrobase ongoing maintenance and development. Become a Sponsor to get your logo on our README and website.

[![Exir Studio](https://avatars.githubusercontent.com/u/181194967?s=200&v=4)](https://exirstudio.com)

### Contributing

Contributions are welcome! Please read our [contribution guidelines](https://github.com/Alwatr/.github/blob/next/CONTRIBUTING.md) before submitting a pull request.

### License

This project is licensed under the [AGPL-3.0 License](LICENSE).
