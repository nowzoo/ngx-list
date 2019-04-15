import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import {
  NgxListFilterFn,
  NgxListSortFn,
  INgxListResult,
  NgxListCompare,
  INgxListParams,
  NgxListColumnValueFn,
  INgxListInit
} from './shared';
import chunk from 'lodash/chunk';
import isFunction from 'lodash/isFunction';
import sortBy from 'lodash/sortBy';
import get from 'lodash/get';
import trim from 'lodash/trim';
import toString from 'lodash/toString';
import isPlainObject from 'lodash/isPlainObject';

export class NgxList  {

  private _src$: Observable<any[]>;
  private _idKey: string;
  private _subscription: Subscription = null;
  private _params$: BehaviorSubject<INgxListParams>;
  private _result$: BehaviorSubject<INgxListResult>;
  private _filters: {[key: string]: NgxListFilterFn};
  private _sortFn: NgxListSortFn;


  /**
   * The default function for deciding when NOT to run a particular
   * filter, based on the value of the filter. By default, this
   * is when the filter value is `undefined`, `null` or an empty string.
   *
   * Used by {@link NgxList#comparisonFilter}
   */
  static ignoreFilterWhen(filterValue: any): boolean {
    return filterValue === null ||
      filterValue === undefined ||
      ('string' === typeof filterValue && 0 === trim(filterValue).length);
  }


  /**
   * A helper function to get the dot-notated keys from an object.
   */
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

  /**
   * A factory that returns an instance of {@Link NgxListSortFn}.
   * Pass on optional options object containing...
   * - fallbackSortColumn?
   *    Optional. The key to sort by if two records are the same by the current sort key
   * - caseSensitive?
   *    Optional. Default false: string columns will be sorted case-insensitively.
   * - valueFns?
   *    Optional. Use this if you want to mess with the values for sorting,
   *    or add a sort key that does not exist in your raw records.
   */
  static sortFn(options?: {
    fallbackSortColumn?: string,
    caseSensitive?: boolean,
    valueFns?: {[key: string]: NgxListColumnValueFn}
  }): NgxListSortFn {
    options = options || {};
    const fallbackSortColumn: string = options.fallbackSortColumn || null;
    const caseSensitive = options.caseSensitive === true;
    const valueFns = options.valueFns || {};
    const fn: NgxListSortFn = (records: any[], sortColumn: string): any[] => {
      const sortFns: NgxListColumnValueFn[] = [];
      if (sortColumn) {
        sortFns.push(NgxList.getColumnValueFn(sortColumn, valueFns, caseSensitive));
      }
      if (fallbackSortColumn && fallbackSortColumn !== sortColumn) {
        sortFns.push(NgxList.getColumnValueFn(fallbackSortColumn, valueFns, caseSensitive));
      }

      const sorted = sortBy(records, sortFns) as  any[];
      return sorted;
    };
    return fn;
  }


  static keySearchValue(
    record: any,
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
    record: any,
    casedSearch: string,
    caseSensitive: boolean,
    ignoredKeys: string[],
    valueFns: {[key: string]: NgxListColumnValueFn}
  ): boolean {
    const keys = NgxList.dotKeys(record, ignoredKeys);
    let matched = false;
    while ((! matched) && (keys.length > 0)) {
      const k = keys.shift();
      const value: string = NgxList.keySearchValue(record, k, valueFns);
      const casedValue: string = caseSensitive ? value : value.toLowerCase();
      if (casedValue.indexOf(casedSearch) > -1) {
        matched = true;
      }
    }
    return matched;
  }

  /**
   * Search filter factory. Pass an options object containing...
   * - caseSensitive?
   *    Optional. Default false -- string values will be compared case-insensitively.
   * - ignoredKeys?
   *    Optional. By default all of the scalar keys in an object are inspected. Pass an
   *    array of string keys to ignore single or multiple paths
   * - valueFns?
   *    Optional. Use this if you want to mess with the values before matching, like
   *    formatting dates.
   */
  static searchFilter(options?: {
    caseSensitive?: boolean,
    ignoredKeys?: string[],
    valueFns?: {[key: string]: NgxListColumnValueFn}
  }): NgxListFilterFn {
    options = isPlainObject(options) ? options : {};
    const caseSensitive: boolean = options.caseSensitive === true;
    const ignoredKeys = options.ignoredKeys || [];
    const valueFns = options.valueFns || {};
    const fn = (records: any[], filterValue: any): any[] => {
      let search: string = ('string' === typeof filterValue) ? trim(filterValue) : '';
      if (search.length === 0) {
        return records.slice();
      }
      if (! caseSensitive) {
        search = search.toLowerCase();
      }
      return records.filter((record: any) => {
        return NgxList.recordMatchesSearch(record, search, caseSensitive, ignoredKeys, valueFns);
      });
    };
    return fn;
  }

  /**
   * Factory for a function that filters the records by comparing a single column against a value.
   */
  static comparisonFilter(options: {
    value: string | NgxListColumnValueFn;
    compare?: NgxListCompare;
    ignoreFilterWhen?: (filterValue: any) => boolean;
  }): NgxListFilterFn  {
    const compare = undefined === options.compare ? NgxListCompare.eq : options.compare;
    const ignoreFilterWhen: (filterValue: any) => boolean = isFunction(options.ignoreFilterWhen) ?
      options.ignoreFilterWhen : NgxList.ignoreFilterWhen;
    const valueFn: NgxListColumnValueFn = isFunction(options.value) ?
      options.value : (record) => get(record, toString(options.value));

    const fn: NgxListFilterFn = (records: any[], filterValue: any): any[] => {
      if (ignoreFilterWhen(filterValue)) {
        return records.slice(0);
      }
      return records.filter((record: any) => {
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



  /**
   * Create a list.
   */
  constructor(options: INgxListInit) {
    this._src$ = options.src$;
    this._idKey = options.idKey;
    const params: INgxListParams = {page: null, recordsPerPage: null, sort: null,  filterValues: null};
    params.page = parseInt(options.page as any, 10);
    if (isNaN(params.page) || params.page < 0) {
      params.page = 0;
    }
    params.recordsPerPage = parseInt(options.recordsPerPage as any, 10);
    if (isNaN(params.recordsPerPage) || params.recordsPerPage < 0) {
      params.recordsPerPage = 10;
    }
    params.sort = Object.assign({key: this._idKey, reversed: false}, options.sort || {});
    params.filterValues = options.filterValues && typeof options.filterValues === 'object' ?
      options.filterValues : {};
    this._filters = options.filters || {};
    this._params$ = new BehaviorSubject(params);
    const initialResult: INgxListResult = Object.assign({}, params, {
      records: [], pageCount: 0, recordCount: 0, unfilteredRecordCount: 0
    });
    this._sortFn = isFunction(options.sortFn) ?
      options.sortFn : NgxList.sortFn({caseSensitive: true, fallbackSortColumn: this._idKey});
    this._result$ = new BehaviorSubject(initialResult) ;
    this._subscription = combineLatest(this._src$, this._params$)
      .subscribe((results: [any[], INgxListParams]) => {
        this._update(...results);
      });

  }

  /**
   * An observable of {@link INgxListResult}.
   */
  get results$(): Observable<INgxListResult> {
    return this._result$.asObservable();
  }

  /**
   * The latest {@link INgxListResult}.
   */
  get currentResult(): INgxListResult {
    return this._result$.value;
  }

  /**
   * The records that belong to the current page.
   */
  get records(): any[] {
    return this.currentResult.records;
  }

  /**
   * The current page number, zero-based. If there are records, this
   * will be between `0` and `[pageCount]{@link NgxList#pageCount} - 1`.
   * If there are no records, it will be `-1`.
   */
  get page(): number {
    return this.currentResult.page;
  }

  /**
   * The current recordsPerPage.
   */
  get recordsPerPage(): number {
    return this.currentResult.recordsPerPage;
  }

  /**
   * The current sort column.
   */
  get sort(): {key: string, reversed: boolean} {
    return Object.assign({}, this._params$.value.sort);
  }

  /**
   * The current filter values.
   */
  get filterValues(): {[key: string]: any} {
    return Object.assign({}, this._params$.value.filterValues);
  }

  /**
   * The current number of pages.
   */
  get pageCount(): number {
    return this.currentResult.pageCount;
  }


  /**
   * The number of records after applying filters.
   */
  get recordCount(): number {
    return this.currentResult.recordCount;
  }

  /**
   * The number of records before applying filters.
   */
  get unfilteredRecordCount(): number {
    return this.currentResult.unfilteredRecordCount;
  }


  /**
   * Unsubscribes from the list source and cleans up.
   * Make sure to call this in your component's `ngOnDestroy` method.
   */
  destroy(): void {
    this._subscription.unsubscribe();
    this._params$.complete();
    this._result$.complete();

  }


  /**
   * Set the page to be displayed. Zero-based.
   */
  setPage(page: number): void {
    page = Math.max(0, page);
    this._params$.next(Object.assign({}, this._params$.value, {page}));
  }

  /**
   * Set the recordsPerPage.
   * Pass `0` for unpaged (all records appear one page.)
   */
  setRecordsPerPage(recordsPerPage: number): void {
    recordsPerPage = Math.max(0, recordsPerPage);
    this._params$.next(Object.assign({}, this._params$.value, {recordsPerPage, page: 0}));
  }

  /**
   * Set the sort key and whether the list should be reversed.
   * Pass true for reversed if you want the list to be sorted in descending (z-a) order
   */
  setSort(sort: {key: string, reversed: boolean}): void {
    this._params$.next(Object.assign({}, this._params$.value, {sort, page: 0}));
  }

  /**
   * Set a filter value.
   */
  setFilterValue(key: string, value: any) {
    const params = Object.assign({}, this._params$.value);
    params.filterValues[key] = value;
    params.page = 0;
    this._params$.next(params);
  }


  /**
   * Update the list when...
   * (1) the source records have changed,
   * (2) the list params have changed.
   * @param  srcRecords The latest source records.
   * @param  listParams The latest list params.
   */
  private _update(srcRecords: any[], listParams: INgxListParams) {

    const unfilteredRecordCount = srcRecords.length;
    let results = srcRecords.slice(0);
    Object.keys(this._filters).forEach(key => {
      const fn = this._filters[key];
      results = fn(results, listParams.filterValues[key]);
    });
    results = this._sortFn(results, listParams.sort.key);
    if (listParams.sort.reversed) {
      results.reverse();
    }
    const recordsPerPage = Math.max(0, listParams.recordsPerPage);
    const recordCount = results.length;
    const pages = recordsPerPage > 0 ? chunk(results, recordsPerPage) : [results];
    const pageCount = pages.length;
    const page = Math.min(pageCount - 1, Math.max(0, listParams.page));
    const records = pageCount > 0 ? pages[page] : [];
    const result: INgxListResult = Object.assign({}, listParams, {
      records, recordCount, pageCount,  unfilteredRecordCount,
      // add these in because they may have changed...
      recordsPerPage, page
    });
    this._result$.next(result);
  }
}
