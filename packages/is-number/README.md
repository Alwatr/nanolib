# is-number

A simple utility to Check the value is number or can convert to a number, for example string ' 123 ' can be converted to 123.

## Installation

```bash
yarn add @alwatr/is-number
```

## Usage

```typescript
import {isNumber} from '@alwatr/is-number';

isNumber('1'); // true
```

## Why is this needed?

```ts
console.log(typeof '123'); //=> 'string'
console.log(+[]); //=> 0
console.log(+''); //=> 0
console.log(+'   '); //=> 0
console.log(typeof NaN); //=> 'number'
console.log(typeof Infinity); //=> 'number'
```

### True

<!-- prettier-ignore -->
```ts
isNumber(5e3);               // true
isNumber(0xff);              // true
isNumber(-1.1);              // true
isNumber(0);                 // true
isNumber(1);                 // true
isNumber(1.1);               // true
isNumber('-1.1');            // true
isNumber('0');               // true
isNumber('0xff');            // true
isNumber('1');               // true
isNumber('1.1');             // true
isNumber('5e3');             // true
isNumber('012');             // true
isNumber(parseInt('012'));   // true
isNumber(parseFloat('012')); // true
```

### False

<!-- prettier-ignore -->
```ts
isNumber(Infinity);          // false
isNumber(NaN);               // false
isNumber(null);              // false
isNumber(undefined);         // false
isNumber('');                // false
isNumber('   ');             // false
isNumber('foo');             // false
isNumber([1]);               // false
isNumber([]);                // false
isNumber(function () {});    // false
isNumber({});                // false
```
