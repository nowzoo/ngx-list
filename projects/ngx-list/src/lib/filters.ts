import {
  NgxListFilterFn,
  NgxListRecord,
  NgxListSearchFilterOptions,
  NgxListFilterOptions,
  NgxListCompare
} from './api';
import {
  NgxListHelpers
} from './helpers';

export class NgxListFilters {
  static searchFilter(opts: NgxListSearchFilterOptions): NgxListFilterFn {
    const options: NgxListSearchFilterOptions = Object.assign({
      caseInsensitive: true, ignoreKeys: [], valueFns: {}
    }, opts);
    const fn = (records: NgxListRecord[], filterParams: {[filterKey: string]: any}): NgxListRecord[] => {
      let search: string = NgxListHelpers.ensureTrimmedString(filterParams[options.filterKey]);
      if (options.caseInsensitive) {
        search = search.toLowerCase();
      }
      if (search.length === 0) {
        return records.slice();
      }

      return records.filter((record: NgxListRecord) => {
        const keys = Object.keys(record).filter(k => options.ignoreKeys.indexOf(k) === -1);
        let matched = false;
        while (! matched && keys.length > 0) {
          const k = keys.shift();
          const value: string = options.valueFns[k] && 'function' === typeof options.valueFns[k] ?
            NgxListHelpers.safeToString(options.valueFns[k](record)) :
            NgxListHelpers.safeToString(NgxListHelpers.get(record, k));
          const cased: string = options.caseInsensitive ? value.toLowerCase() : value;
          if (cased.indexOf(search) > -1) {
            matched = true;
          }
        }
        return matched;
      });
    };
    return fn;
  }

  static comparisonFilter(opts: NgxListFilterOptions): NgxListFilterFn  {
    const options: NgxListFilterOptions = Object.assign({
      ignoreWhenFilterIs: Object.keys(opts).indexOf('ignoreWhenFilterIs') > -1 ? opts.ignoreWhenFilterIs : null,
      compare: NgxListCompare.equals,
      valueFn: opts.valueFn && typeof opts.valueFn === 'function' ? opts.valueFn : (r: NgxListRecord) => r[opts.columnKey],
      caseInsensitive: opts.caseInsensitive === true
    }, opts);
    const fn: NgxListFilterFn = (records: NgxListRecord[], filterParams: {[filterKey: string]: any}): NgxListRecord[] => {
      const rawFilterValue = filterParams[options.filterKey];
      if (rawFilterValue === options.ignoreWhenFilterIs) {
        return records.slice(0);
      }
      const filterValue = options.caseInsensitive ?
        NgxListHelpers.ensureTrimmedString(rawFilterValue).toLowerCase() : rawFilterValue;
      return records.filter((record: NgxListRecord) => {
        const rawRecordValue = options.valueFn(record);
        const recordValue = options.caseInsensitive ?
          NgxListHelpers.ensureTrimmedString(rawRecordValue).toLowerCase() : rawRecordValue;
        switch (options.compare) {
          case NgxListCompare.equals: return recordValue === filterValue;
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
