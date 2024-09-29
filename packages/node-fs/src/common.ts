import {AsyncQueue} from '@alwatr/async-queue';
import {createLogger} from '@alwatr/logger';
import {packageTracer} from '@alwatr/package-tracer';

packageTracer.add(__package_name__, __package_version__);

export const logger = createLogger('@alwatr/node-fs');

export const asyncQueue = new AsyncQueue();
