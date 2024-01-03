import {definePackage, definedPackageList} from '@alwatr/dedupe';

// Must throw an error

console.log('define test1 package')
definePackage('@scope/test1');

console.log('define test2 package')
definePackage('@scope/test2', 'v1.0.0');

console.log('definedPackageList:', definedPackageList)

console.log('redefine test2 package')
definePackage('@scope/test2');
