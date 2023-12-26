# Typescript Type Helpers

Collection of useful typescript type helpers.

## Installation

```bash
yarn add @alwatr/type-helper
```

## Usage

```typescript
import type {JSONObject} from '@alwatr/type-helper';

const obj: JSONObject = {
  foo: 'bar',
  baz: {
    qux: 1,
    arr: [1, 2, 3],
  },
  qux: true,
};
```

Read the [source code](https://github.com/Alwatr/nanolib/tree/next/packages/type-helper/src) for more details.
