# Alwatr Logger - `@alwatr/logger`

Fancy colorful console debugger with custom scope written in tiny TypeScript, ES module.

## Example usage

```ts
import {createLogger} from '@alwatr/logger';

const logger = createLogger('demo');

function sayHello(name: string) {
  logger.logMethodArgs?.('sayHello', {name});
}
```

### Debug/Develope Mode (DEBUG_MODE)

Many of the methods in the logger are no-ops when the debug mode is off. This is to prevent unnecessary performance impact in production.

#### Browser

```ts
window.localStorage?.setItem('debug', '1');

// Please remember to **reload** the window after changing the debug mode.
```

> Make sure the [log level](https://developer.chrome.com/docs/devtools/console/log/#browser) in set correctly.

#### CLI

```sh
DEBUG=1 node index.js
```
