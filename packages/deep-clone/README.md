# Deep Clone

Clone deeply nested objects and arrays in JavaScript.

## Installation

```bash
yarn add @alwatr/deep-clone
```

## Usage

```typescript
import deepClone from '@alwatr/deep-clone';

const obj1 = {
  a: 1,
  b: {
    c: 2,
    d: [3, 4, 5],
  },
};

const obj2 = deepClone(obj1);

obj2.b.c = 6;
console.log(obj1.b.c); // 2
```
