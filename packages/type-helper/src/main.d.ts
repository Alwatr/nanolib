export type * from './types.d.ts';

import type {
  DictionaryOpt as DictionaryOpt_,
  DictionaryReq as DictionaryReq_,
} from './types';

declare global {
  type DictionaryOpt<T = any> = DictionaryOpt_<T>;
  type DictionaryReq<T = any> = DictionaryReq_<T>;
}
