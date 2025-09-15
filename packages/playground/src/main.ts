/**
 * @module playground
 *
 * A development-only package for testing and experimenting with the other packages in this repository.
 * This file is not intended for production use.
 */

import {createLogger} from '@alwatr/nanolib';
import '@alwatr/nanolib/exit-hook';
import '@alwatr/nanolib/node-fs';
// import '@alwatr/nanolib/dedupe';

/* #__PURE__ */
createLogger('playground');

console.log('salam');
