# Dedupe

A package manager helper tool for debug list of defined (imported) packages in your ecosystem and prevent to duplicate import (install) multiple versions of the same package in your project (deduplicate packages).

## Example usage

```ts
import {definePackage} from '@alwatr/dedupe';

definePackage('@alwatr/logger', '2.0.0');
```

You can use __package_version__ to automatically obtain the version of the package if you are using @alwatr/nano-build to build your package.

```ts
definePackage('@alwatr/logger', __package_version__);
```
