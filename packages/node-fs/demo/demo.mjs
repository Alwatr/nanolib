import {writeJsonFile, WriteFileMode} from '@alwatr/node-fs';

await writeJsonFile('./file.json', {a: 1, b: 2, c: 3}, WriteFileMode.Rename);
await writeJsonFile('./file.json', {a: 1, b: 2, c: 3}, WriteFileMode.Rename);
