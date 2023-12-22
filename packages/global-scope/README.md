# Global Scope

Cross-platform substitute for globalThis that operates in both Node.js and the browser, providing accurate type definitions and additional global variables to improve debugging.

## Installation

```bash
yarn add @alwatr/global-scope
```

## Usage

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
