# Node FS

Enhanced file system operations in Node.js, including reading, writing, and handling JSON files, with both synchronous and asynchronous options.

## Installation

```bash
yarn add @alwatr/node-fs
```

## Usage

```typescript
import {writeJsonFile, WriteFileMode} from '@alwatr/node-fs';

await writeJsonFile('./file.json', {a: 1, b: 2, c: 3}, WriteFileMode.Replace);
```
