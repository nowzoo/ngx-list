import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';

import chunk from 'lodash/chunk';
import isFunction from 'lodash/isFunction';

import {
  NgxListFilterFn,
  NgxListSortFn,
  INgxListResult,
  INgxListParams,
  INgxListInit
} from './shared';

import { NgxListFnFactory } from './fn-factory';


export class NgxList {

  private _src$: Observable<any[]>;
  private _idKey: string;
  private _subscription: Subscription = null;
  private _params$: BehaviorSubject<INgxListParams>;
  private _result$: BehaviorSubject<INgxListResult>;
  private _filters: {[key: string]: NgxListFilterFn};
  private _sortFn: NgxListSortFn;


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
      options.sortFn : NgxListFnFactory.sortFn({caseSensitive: true, fallbackSortColumn: this._idKey});
    this._result$ = new BehaviorSubject(initialResult) ;
    this._subscription = combineLatest(this._src$, this._params$)
      .subscribe((results: [any[], INgxListParams]) => {
        this._update(...results);
      });

  }

  /**
   * An observable of {@link INgxListResult}.
   */
  get result$(): Observable<INgxListResult> {
    return this._result$.asObservable();
  }

  /**
   * The latest {@link INgxListResult}.
   */
  get result(): INgxListResult {
    return this._result$.value;
  }

  /**
   * The records that belong to the current page.
   */
  get records(): any[] {
    return this.result.records;
  }

  /**
   * The current page number, zero-based. If there are records, this
   * will be between `0` and `[pageCount]{@link NgxList#pageCount} - 1`.
   * If there are no records, it will be `-1`.
   */
  get page(): number {
    return this.result.page;
  }

  /**
   * The current recordsPerPage.
   */
  get recordsPerPage(): number {
    return this.result.recordsPerPage;
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
    return this.result.pageCount;
  }


  /**
   * The number of records after applying filters.
   */
  get recordCount(): number {
    return this.result.recordCount;
  }

  /**
   * The number of records before applying filters.
   */
  get unfilteredRecordCount(): number {
    return this.result.unfilteredRecordCount;
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
  setFilterValue(key: string, value: any): void {
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
