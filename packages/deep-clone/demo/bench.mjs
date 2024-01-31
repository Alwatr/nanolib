import {deepClone} from '@alwatr/deep-clone';

const obj1 = {};
for (let i = 0; i < 100; i++) {
  obj1[i] = {a: 1, b: {c: 2}};
}

console.log('start');

const startTime = performance.now();

for (let i = 1; i <= 100_000; i++) {
  const obj2 = deepClone(obj1);
}

console.log(`Execution time: ${Math.round(performance.now() - startTime)}ms`);
