import {
  Record,
  SortFn,
  SortFunctionOptions
} from './api';
import { Helpers } from './helpers';

export class Sort {

  static compareValues(a: any, b: any, caseInsensitive: boolean): number {
    const aVal = Helpers.orNull(a);
    const bVal = Helpers.orNull(b);
    if (aVal === null && bVal === null) {
      return 0;
    }
    if (aVal === null) {
      return 1;
    }
    if (bVal === null) {
      return -1;
    }
    if (caseInsensitive && ('string' === typeof aVal) && ('string' === typeof bVal)) {
      const aStr = aVal.toLowerCase();
      const bStr = bVal.toLowerCase();
      if (aStr === bStr) {
        return 0;
      }
      return aStr > bStr ? 1 : -1;
    }
    if (aVal === bVal) {
      return 0;
    }
    return aVal > bVal ? 1 : -1;
  }
  static sortFn(opts?: SortFunctionOptions): SortFn {
    opts = opts || {};
    const options = Object.assign({
      caseInsensitive: opts.caseInsensitive !== false,
      valueFns: {}
    }, opts);

    const fn: SortFn = (records: Record[], sortColumn: string): Record[] => {
      const sorted = records.slice();
      if (! sortColumn) {
        return sorted;
      }
      const valueFn = options.valueFns[sortColumn] && 'function' === typeof options.valueFns[sortColumn] ?
        options.valueFns[sortColumn] : (record: Record) => Helpers.get(record, sortColumn, null);

      const defaultValueFn = options.fallbackSortColumn ?
         options.valueFns[options.fallbackSortColumn] && 'function' === typeof options.valueFns[options.fallbackSortColumn] ?
          options.valueFns[options.fallbackSortColumn] : (record: Record) => Helpers.get(record, options.fallbackSortColumn, null)
          : null;


      sorted.sort((a: Record, b: Record) => {
        const aVal = Helpers.orNull(valueFn(a));
        const bVal = Helpers.orNull(valueFn(b));
        const bySortKey = Sort.compareValues(aVal, bVal, options.caseInsensitive);
        if (bySortKey !== 0) {
          return bySortKey;
        }
        if (! defaultValueFn) {
          return bySortKey;
        }
        if (options.fallbackSortColumn === sortColumn) {
          return bySortKey;
        }
        const aFallback = Helpers.orNull(defaultValueFn(a));
        const bFallback = Helpers.orNull(defaultValueFn(b));
        return Sort.compareValues(aFallback, bFallback, options.caseInsensitive);

      });
      return sorted;
    };
    return fn;
  }
}
