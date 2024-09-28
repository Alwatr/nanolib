import {createLogger} from '@alwatr/logger';

const logger = createLogger(__package_name__);

import type {Dictionary} from '@alwatr/type-helper';

export const packageTracer =  {
  list: {} as Readonly<Dictionary<readonly string[]>>,

  add(packageName: string, version: string): void {
    logger.logMethodArgs?.('add', {packageName, version});
    (this.list[packageName] as string[]) ??= [];
    (this.list[packageName] as string[]).push(version);
  },

  has(packageName: string): boolean {
    const exist = Object.hasOwn(this.list, packageName);
    logger.logMethodFull?.('has', {packageName}, exist);
    return exist;
  },

  get(packageName: string): readonly string[] | undefined {
    logger.logMethodArgs?.('get', {packageName});
    return this.list[packageName];
  },
} as const;
