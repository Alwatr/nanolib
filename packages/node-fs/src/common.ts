import {AsyncQueue} from '@alwatr/async-queue';
import {createLogger} from '@alwatr/logger';

import type {} from '@alwatr/nano-build';

export const logger = createLogger('@alwatr/node-fs');

export const asyncQueue = new AsyncQueue();
