# Global Scope

Cross-platform substitute for globalThis that operates in both Node.js and the browser, providing accurate type definitions and additional global variables to improve debugging.

## Installation

```bash
yarn add @alwatr/global-scope
```

## Usage

### globalScope

Alternative to `globalThis` that works cross-platform.

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

### sharedScope_

A global variable that can be used to share state across modules without accessible publicly in the global scope.

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
