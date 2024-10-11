import {createLogger} from '@alwatr/nanolib';
import {exitHook} from '@alwatr/nanolib/node';

createLogger('playground');

exitHook(() => {
  console.log('Exiting...');
});
