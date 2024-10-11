import {AsyncQueue} from '@alwatr/async-queue';
import {createLogger} from '@alwatr/logger';
import {packageTracer} from '@alwatr/package-tracer';

__dev_mode__: packageTracer.add(__package_name__, __package_version__);

export const logger = /* #__PURE__ */ createLogger('@alwatr/node-fs');

export const asyncQueue = /* #__PURE__ */ new AsyncQueue();
