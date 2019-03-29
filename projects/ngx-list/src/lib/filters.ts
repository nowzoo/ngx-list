import {
  FilterFn,
  Record,
  SearchFilterOptions,
  FilterOptions,
  Compare
} from './shared';
import {
  Helpers
} from './helpers';


export class Filters {
  static searchFilter(opts: SearchFilterOptions): FilterFn {
    const options: SearchFilterOptions = Object.assign({
      caseInsensitive: true, ignoreKeys: [], valueFns: {}
    }, opts);
    const fn = (records: Record[], filterParams: {[filterKey: string]: any}): Record[] => {
      let search: string = Helpers.ensureTrimmedString(filterParams[options.filterKey]);
      if (options.caseInsensitive) {
        search = search.toLowerCase();
      }
      if (search.length === 0) {
        return records.slice();
      }

      return records.filter((record: Record) => {
        const keys = Object.keys(record).filter(k => options.ignoreKeys.indexOf(k) === -1);
        let matched = false;
        while (! matched && keys.length > 0) {
          const k = keys.shift();
          const value: string = options.valueFns[k] && 'function' === typeof options.valueFns[k] ?
            Helpers.safeToString(options.valueFns[k](record)) :
            Helpers.safeToString(Helpers.get(record, k));
          const cased: string = options.caseInsensitive ? value.toLowerCase() : value;
          console.log(cased, search);
          if (cased.indexOf(search) > -1) {
            matched = true;
          }
        }
        return matched;
      });
    };
    return fn;
  }

  static comparisonFilter(opts: FilterOptions): FilterFn  {
    const options: FilterOptions = Object.assign({
      ignoreWhenFilterIs: Object.keys(opts).indexOf('ignoreWhenFilterIs') > -1 ? opts.ignoreWhenFilterIs : null,
      compare: Compare.equals,
      valueFn: opts.valueFn && typeof opts.valueFn === 'function' ? opts.valueFn : (r: Record) => r[opts.columnKey],
      caseInsensitive: opts.caseInsensitive === true
    }, opts);
    const fn: FilterFn = (records: Record[], filterParams: {[filterKey: string]: any}): Record[] => {
      const rawFilterValue = filterParams[options.filterKey];
      if (rawFilterValue === options.ignoreWhenFilterIs) {
        return records.slice(0);
      }
      const filterValue = options.caseInsensitive ?
        Helpers.ensureTrimmedString(rawFilterValue).toLowerCase() : rawFilterValue;
      return records.filter((record: Record) => {
        const rawRecordValue = options.valueFn(record);
        const recordValue = options.caseInsensitive ?
          Helpers.ensureTrimmedString(rawRecordValue).toLowerCase() : rawRecordValue;
        switch (options.compare) {
          case Compare.equals: return recordValue === filterValue;
          case Compare.gt: return recordValue > filterValue;
          case Compare.gte: return recordValue >= filterValue;
          case Compare.lt: return recordValue < filterValue;
          case Compare.lte: return recordValue <= filterValue;
        }
        return false;
      });
    };
    return fn;
  }
}
