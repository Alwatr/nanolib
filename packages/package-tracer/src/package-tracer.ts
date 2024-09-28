import {createLogger, type AlwatrLogger} from '@alwatr/logger';

import type {Dictionary} from '@alwatr/type-helper';

export const packageTracer =  {
  add,
  list: {} as Dictionary<string[]>,
} as const;

function add(packageName: string, version = 'v?', debugMode?: boolean): AlwatrLogger {
  const logger = createLogger(`{${packageName}}`, debugMode);
  logger.logMethodArgs?.('add', {packageName, version});
  packageTracer.list[packageName] ??= []
  packageTracer.list[packageName].push(version);
}
