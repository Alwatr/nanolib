import {writeJsonFile, WriteFileMode} from '@alwatr/node-fs';

for (let i = 10; i > 0; i--) {
  console.log('request write file %s without waiting...', i);
  writeJsonFile('./file.json', {i, a: 'b'}, WriteFileMode.Rename);
}

console.log('loop done, wait for queue process')
