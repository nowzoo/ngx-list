import {
  NgxListRecord,
  NgxListSortFn,
  NgxListColumnValueFn,
  NGxListSortFunctionOptions
} from './shared';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import isFunction from 'lodash/isFunction';


export class NgxListSort {

  /**
   * A factory that returns an instance of {@Link NgxListSortFn}.
   */
  static sortFn(options?: NGxListSortFunctionOptions): NgxListSortFn {
    options = options || {};
    const fallbackSortColumn: string = options.fallbackSortColumn || null;
    const caseSensitive = options.caseSensitive === true;
    const valueFns = options.valueFns || {};
    const fn: NgxListSortFn = (records: NgxListRecord[], sortColumn: string): NgxListRecord[] => {
      const sortFns: NgxListColumnValueFn[] = [];
      if (sortColumn) {
        sortFns.push(NgxListSort.getColumnValueFn(sortColumn, valueFns, caseSensitive));
      }
      if (fallbackSortColumn && fallbackSortColumn !== sortColumn) {
        sortFns.push(NgxListSort.getColumnValueFn(fallbackSortColumn, valueFns, caseSensitive));
      }

      const sorted = sortBy(records, sortFns) as  NgxListRecord[];
      return sorted;
    };
    return fn;
  }

  /**
   * A helper method to get the value function for a column.
   */
  static getColumnValueFn(
    k: string,
    valueFns: {[key: string]: NgxListColumnValueFn} = {},
    caseSensitive: boolean
  ): NgxListColumnValueFn {
    if (isFunction(valueFns[k])) {
      return valueFns[k];
    }
    return (record) => {
      const value = get(record, k);
      if ((! caseSensitive) && typeof value === 'string') {
        return (value as string).toLowerCase();
      }
      return value;
    };
  }
}
