# Local Storage Helper

A utility for managing local storage.

## Installation

```bash
yarn add @alwatr/local-storage
```

## Usage

```typescript
import {getLocalStorageItem} from '@alwatr/local-storage';

const value = getLocalStorageItem('my-item', 1, {a: 1, b: 2});
```
