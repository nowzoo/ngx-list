import {
  NgxListFilterFn,
  NgxListColumnValueFn,
  NgxListRecord,
  NgxListCompare,
  NgxListSearchFilterOptions,
  NgxListCompareFilterOptions
} from './shared';
import trim from 'lodash/trim';
import toString from 'lodash/toString';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';

/**
 * Static methods to easily create search and comparison filters.
 */
export class NgxListFilters {

  /**
   * The default function for deciding when NOT to run a particular
   * filter, based on the value of the filter. By default, this
   * is when the filter value is `undefined`, `null` or an empty string.
   *
   * Used by {@link NgxListFilters#comparisonFilter}
   */
  static ignoreFilterWhen(filterValue: any): boolean {
    return filterValue === null ||
      filterValue === undefined ||
      ('string' === typeof filterValue && 0 === trim(filterValue).length);
  }

  /**
   * Search filter factory.
   *
   */
  static searchFilter(options: NgxListSearchFilterOptions): NgxListFilterFn {
    const filterKey: string = options.filterKey;
    const caseSensitive: boolean = options.caseSensitive === true;
    const inspectKeys = options.inspectKeys || [];
    const ignoreKeys = options.ignoreKeys || [];
    const valueFns = options.valueFns || [];
    const fn = (records: NgxListRecord[], filterParams: {[filterKey: string]: any}): NgxListRecord[] => {
      let search: string = 'string' === typeof filterParams[filterKey] ? trim(filterParams[filterKey]) : '';
      if (! caseSensitive) {
        search = search.toLowerCase();
      }
      if (search.length === 0) {
        return records.slice();
      }
      return records.filter((record: NgxListRecord) => {
        const keys = [...Object.keys(record), ...inspectKeys].filter(k => ignoreKeys.indexOf(k) === -1);
        let matched = false;
        while (! matched && keys.length > 0) {
          const k = keys.shift();
          const value: string = isFunction(valueFns[k]) ?
            toString(valueFns[k](record)) :
            toString(get(record, k));
          const casedValue: string = caseSensitive ? value : value.toLowerCase();
          if (casedValue.indexOf(search) > -1) {
            matched = true;
          }
        }
        return matched;
      });
    };
    return fn;
  }

  /**
   * Factory for a function that filters the records by comparing a single column against a value.
   */
  static comparisonFilter(options: NgxListCompareFilterOptions): NgxListFilterFn  {
    const filterKey = options.filterKey;
    const columnKey = options.columnKey;
    const compare = undefined === options.compare ? NgxListCompare.eq : options.compare;
    const ignoreFilterWhen: (filterValue: any) => boolean = isFunction(options.ignoreFilterWhen) ?
      options.ignoreFilterWhen : NgxListFilters.ignoreFilterWhen;
    const valueFn: NgxListColumnValueFn = isFunction(options.valueFn) ?
      options.valueFn : (record) => get(record, columnKey);
    const fn: NgxListFilterFn = (records: NgxListRecord[], filterParams: {[filterKey: string]: any}): NgxListRecord[] => {
      const filterValue = filterParams[filterKey];
      if (ignoreFilterWhen(filterValue)) {
        return records.slice(0);
      }
      return records.filter((record: NgxListRecord) => {
        const recordValue = valueFn(record);
        switch (compare) {
          case NgxListCompare.eq: return recordValue === filterValue;
          case NgxListCompare.neq: return recordValue !== filterValue;
          case NgxListCompare.gt: return recordValue > filterValue;
          case NgxListCompare.gte: return recordValue >= filterValue;
          case NgxListCompare.lt: return recordValue < filterValue;
          case NgxListCompare.lte: return recordValue <= filterValue;
        }
        return false;
      });
    };
    return fn;
  }
}
