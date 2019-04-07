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
import isPlainObject from 'lodash/isPlainObject';

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
    const ignoreKeys = options.ignoreKeys || [];
    const valueFns = options.valueFns || {};
    const fn = (records: NgxListRecord[], filterParams: {[filterKey: string]: any}): NgxListRecord[] => {
      let search: string = 'string' === typeof filterParams[filterKey] ? trim(filterParams[filterKey]) : '';
      if (search.length === 0) {
        return records.slice();
      }
      if (! caseSensitive) {
        search = search.toLowerCase();
      }
      return records.filter((record: NgxListRecord) => {
        return NgxListFilters.recordMatchesSearch(record, search, caseSensitive, ignoreKeys, valueFns);
      });
    };
    return fn;
  }

  static keySearchValue(
    record: NgxListRecord,
    key: string,
    valueFns: {[key: string]: NgxListColumnValueFn}
  ): string {
    if (isFunction(valueFns[key])) {
      return toString(valueFns[key](record));
    }
    const value = get(record, key, '');
    if (isPlainObject(value)) {
      return '';
    }
    if (isFunction(value)) {
      return '';
    }
    if (Array.isArray(value)) {
      return '';
    }
    if ('boolean' === typeof value) {
      return '';
    }
    if ('number' === typeof value && isNaN(value)) {
      return '';
    }
    return toString(value);

  }

  static recordMatchesSearch(
    record: NgxListRecord,
    casedSearch: string,
    caseSensitive: boolean,
    ignoredKeys: string[],
    valueFns: {[key: string]: NgxListColumnValueFn}
  ): boolean {
    const keys = NgxListFilters.dotKeys(record, ignoredKeys);
    let matched = false;
    while ((! matched) && (keys.length > 0)) {
      const k = keys.shift();
      const value: string = NgxListFilters.keySearchValue(record, k, valueFns);
      const casedValue: string = caseSensitive ? value : value.toLowerCase();
      if (casedValue.indexOf(casedSearch) > -1) {
        matched = true;
      }
    }
    return matched;
  }

  /**
   * Factory for a function that filters the records by comparing a single column against a value.
   */
  static comparisonFilter(options: NgxListCompareFilterOptions): NgxListFilterFn  {
    const filterKey = options.filterKey;
    const compare = undefined === options.compare ? NgxListCompare.eq : options.compare;
    const ignoreFilterWhen: (filterValue: any) => boolean = isFunction(options.ignoreFilterWhen) ?
      options.ignoreFilterWhen : NgxListFilters.ignoreFilterWhen;
    const valueFn: NgxListColumnValueFn = isFunction(options.value) ?
      options.value : (record) => get(record, toString(options.value));
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



  static dotKeys(x: any, ignoredKeys: string[] = []): string[] {
    const dotKeys: string[] = [];
    const recurse = (y: any, currentKeys: string[] = []) => {
      const dotKey = currentKeys.length > 0 ? currentKeys.join('.') : null;
      const ignored = (dotKey === null) ? false : ignoredKeys.filter(iK => dotKey.indexOf(iK) === 0).length > 0;
      if (ignored) {
        return;
      }
      if (dotKey) {
        dotKeys.push(dotKey);
      }
      if (typeof y === 'object' && null !== y) {
        Object.keys(y).forEach(k => recurse(y[k], [...currentKeys, k]));
      }
    };
    recurse(x);
    return dotKeys;
  }

}
