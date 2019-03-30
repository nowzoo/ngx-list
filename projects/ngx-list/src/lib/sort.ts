import {
  NgxListRecord,
  NgxListSortFn,
  NgxListSortFunctionOptions
} from './api';
import { NgxListHelpers } from './helpers';

export class NgxListSort {

  static compareValues(a: any, b: any, caseInsensitive: boolean): number {
    const aVal = NgxListHelpers.orNull(a);
    const bVal = NgxListHelpers.orNull(b);
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
  static sortFn(opts?: NgxListSortFunctionOptions): NgxListSortFn {
    opts = opts || {};
    const options = Object.assign({
      caseInsensitive: opts.caseInsensitive !== false,
      valueFns: {}
    }, opts);

    const fn: NgxListSortFn = (records: NgxListRecord[], sortColumn: string): NgxListRecord[] => {
      const sorted = records.slice();
      if (! sortColumn) {
        return sorted;
      }
      const valueFn = options.valueFns[sortColumn] && 'function' === typeof options.valueFns[sortColumn] ?
        options.valueFns[sortColumn] : (record: NgxListRecord) => NgxListHelpers.get(record, sortColumn, null);

      const defaultValueFn = options.fallbackSortColumn ?
         options.valueFns[options.fallbackSortColumn] && 'function' === typeof options.valueFns[options.fallbackSortColumn] ?
          options.valueFns[options.fallbackSortColumn] :
            (record: NgxListRecord) => NgxListHelpers.get(record, options.fallbackSortColumn, null)
          : null;


      sorted.sort((a: NgxListRecord, b: NgxListRecord) => {
        const aVal = NgxListHelpers.orNull(valueFn(a));
        const bVal = NgxListHelpers.orNull(valueFn(b));
        const bySortKey = NgxListSort.compareValues(aVal, bVal, options.caseInsensitive);
        if (bySortKey !== 0) {
          return bySortKey;
        }
        if (! defaultValueFn) {
          return bySortKey;
        }
        if (options.fallbackSortColumn === sortColumn) {
          return bySortKey;
        }
        const aFallback = NgxListHelpers.orNull(defaultValueFn(a));
        const bFallback = NgxListHelpers.orNull(defaultValueFn(b));
        return NgxListSort.compareValues(aFallback, bFallback, options.caseInsensitive);

      });
      return sorted;
    };
    return fn;
  }
}
