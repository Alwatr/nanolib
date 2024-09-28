# Global Scope Module

## globalScope

This TypeScript module provides a cross-platform alternative to `globalThis` named `globalScope`. This object works across different environments, including browsers (`window`), Node.js (`global`), and Web Workers (`self`).

```typescript
import {globalScope} from '@alwatr/global-scope';

globalScope.alwatr = {
  ...globalScope.alwatr,
  version: '1.0.0',
};

globalScope.setTimeout(() => {
  console.log(globalScope.alwatr.version); // 1.0.0
}, 1_000);
```

The module also includes a polyfill for `globalThis` to ensure compatibility across different JavaScript environments.

```typescript
if (globalScope.globalThis !== globalScope) {
  globalScope.globalThis = globalScope;
}
```

## Shared Scope

The module exports a `sharedScope_` object. This object can be used to share state across different modules without making the data publicly accessible in the global scope.

For example, one module can set a property on `sharedScope_`, and another module can read that property. This allows for data sharing between different parts of your application.

```typescript
// module1.ts
import {sharedScope_} from '@alwatr/global-scope';
sharedScope_.foo = 'bar';
```

```typescript
// module2.ts
import {sharedScope_} from '@alwatr/global-scope';
console.log(sharedScope_.foo); // 'bar'
```

### Global Scope Duplication Check

The module includes a check for duplication of the global scope definition. If the global scope has already been defined, an error is thrown.

```typescript
if (globalScope.__shared_scope_defined__ !== undefined) {
  throw new Error('global_scope_module_duplicated');
}
globalScope.__shared_scope_defined__ = true;
```

This ensures that the global scope module is not accidentally included multiple times, which could lead to unexpected behavior from shared scope.

## Sponsors

The following companies, organizations, and individuals support Nitrobase ongoing maintenance and development. Become a Sponsor to get your logo on our README and website.

[![Exir Studio](https://avatars.githubusercontent.com/u/181194967?s=200&v=4)](https://exirstudio.com)

### Contributing

Contributions are welcome! Please read our [contribution guidelines](https://github.com/Alwatr/.github/blob/next/CONTRIBUTING.md) before submitting a pull request.

### License

This project is licensed under the [AGPL-3.0 License](LICENSE).
