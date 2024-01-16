# Local Storage Helper

A utility object for working with local storage and JSON data.

## Installation

```bash
yarn add @alwatr/local-storage
```

## Usage

```typescript
import {getLocalStorageItem} from '@alwatr/local-storage';

const value = localJsonStorage.getItem('myItem', {a: 1, b: 2});
localJsonStorage.setItem('myItem', {a: 1, b: 2});
localJsonStorage.removeItem('myItem');
```
