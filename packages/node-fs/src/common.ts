import {AsyncQueue} from '@alwatr/async-queue';
import {definePackage} from '@alwatr/logger';

import type {} from '@alwatr/nano-build';

export const logger = definePackage('@alwatr/node-fs', __package_version__);

export const asyncQueue = new AsyncQueue();
