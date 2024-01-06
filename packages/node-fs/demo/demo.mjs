import {writeJsonFile, WriteFileMode} from '@alwatr/node-fs';

const max = 100;
for (let i = 0; i < max; i++) {
  console.log('write file', i)
  writeJsonFile('./file.json', {a: Math.random()}, WriteFileMode.Copy);
}

console.log('loop done, wait for queue process')
