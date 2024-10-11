import {createLogger} from '@alwatr/nanolib';
import {exitHook} from '@alwatr/nanolib/exit-hook';
import '@alwatr/nanolib/node-fs'

createLogger('playground');

exitHook(() => {
  console.log('Exiting...');
});
