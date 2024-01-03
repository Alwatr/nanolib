# Exit Hook

A utility for registering exit handlers in Node.js.

## Installation

```bash
yarn add @alwatr/exit-hook
```

## Usage

```typescript
import {exitHook} from '@alwatr/exit-hook';

const saveAllData = () => {
  // save all data
};

exitHook(saveAllData);
```
