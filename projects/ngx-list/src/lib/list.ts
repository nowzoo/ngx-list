import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { NgxListSort } from './sort';
import {
  NgxListFilterFn,
  NgxListSortFn,
  NgxListRecord,
  NgxListInit,
  NgxListResult,
  NgxListFilterParams,
  NgxListParams
} from './shared';
import chunk from 'lodash/chunk';


export class NgxList  {

  private _subscription: Subscription = null;
  private _listParams$: BehaviorSubject<NgxListParams>;
  private _paused$: BehaviorSubject<boolean>;
  private _result$: BehaviorSubject<NgxListResult>;
  private _filters: NgxListFilterFn[];
  private _sortFn: NgxListSortFn;

  /**
   * Create an instance of NgxList with an {@link NgxListInit} object with the
   * following (mostly optional) properties:
   *
   * - `src$: Observable<NgxListRecord[]` Required. The source of your list
   * records, such as from a data API or just `of([{a: 1}, {b: 2}])`
   * - `filters?: NgxListFilterFn[]` Optional. An array of filter functions.
   * You can easily create search and comparison filters with the factory
   * methods provided by {@link NgxListFilters}: [searchFilter]{@link NgxListFilters#searchFilter}
   * and [comparisonFilter]{@link NgxListFilters#comparisonFilter}, or roll your own filters.
   * - `sortFn?: NgxListSortFn` Optional. If omitted, a sorting function will be created for you
   * using the {@link NgxListSort} [sortFn]{@link NgxListSort#sortFn} factory method
   *
   * Passing your own sort function:
   *
   *    const mySort = (records) => {
   *       const sorted = records.slice(0);
   *       sorted.reverse();
   *       return sorted;
   *    }
   *    const list = new NgxList({src$: myApi.getRecords(), sortFn: mySort});
   *
   *
   */
  constructor(init: NgxListInit) {
    this._init(init);
  }

  /**
   * An observable of {@link NgxListResult}.
   */
  get results$(): Observable<NgxListResult> {
    return this._result$.asObservable();
  }

  /**
   * The latest {@link NgxListResult}.
   */
  get currentResult(): NgxListResult {
    return this._result$.value;
  }

  /**
   * The records that belong to the current page.
   */
  get records(): NgxListRecord[] {
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
   * The current number of pages.
   */
  get pageCount(): number {
    return this.currentResult.pageCount;
  }

  /**
   * The current recordsPerPage.
   */
  get recordsPerPage(): number {
    return this.currentResult.recordsPerPage;
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
   * The current filter params.
   */
  get filterParams(): NgxListFilterParams {
    return this.currentResult.filterParams;
  }

  /**
   * The current sort column.
   */
  get sortColumn(): string {
    return this.currentResult.sortColumn;
  }

  /**
   * Whether or not the list is sorted in reverse ('desending')  order.
   */
  get sortReversed(): boolean {
    return this.currentResult.sortReversed;
  }

  /**
   * Whether the list has been paused, ether because you
   * set `initiallyPaused: true` in the  {@link NgxListInit} you passed
   * to the [constructor]{@link NgxList#constructor},
   * or because you have called [stop()]{@link NgxList#stop}.
   */
  get paused(): boolean {
    return this._paused$.value;
  }

  /**
   * The sorting function that was passed to, or created by, the constructor.
   */
  get sortFn(): NgxListSortFn {
    return this._sortFn;
  }

  /**
   * The filter functions.
   */
  get filters(): NgxListFilterFn[] {
    return this._filters;
  }


  /**
   * Starts or restarts updating the list.
   * You don't have to call this unless you have
   * passed `initiallyPaused: true` in the  {@link NgxListInit} you passed
   * to the [constructor]{@link NgxList#constructor},
   * or have previously called [stop()]{@link NgxList#stop}.
   */
  start(): void {
    this._paused$.next(false);
  }

  /**
   * Stop updating the list.
   */
  stop(): void {
    this._paused$.next(true);
  }

  /**
   * Unsubscribes from the list source and cleans up.
   * Make sure to call this in your component's `ngOnDestroy` method.
   */
  destroy(): void {
    this._subscription.unsubscribe();
    this._paused$.complete();
    this._listParams$.complete();
    this._result$.complete();

  }


  /**
   * Set the page to be displayed. Zero-based.
   * @param page The page number.
   */
  setPage(page: number): void {
    page = Math.max(0, page);
    this._listParams$.next(Object.assign({}, this._listParams$.value, {page}));
  }

  /**
   * Set the recordsPerPage. Pass `0` for unpaged (all records appear on the first page.)
   * @param recordsPerPage The number of records per page.
   */
  setRecordsPerPage(recordsPerPage: number): void {
    recordsPerPage = Math.max(0, recordsPerPage);
    this._listParams$.next(Object.assign({}, this._listParams$.value, {recordsPerPage}));
  }

  /**
   * Set the sort column key and whether the list should be reversed.
   * @param sortColumn   The column key.
   * @param sortReversed Pass `false` for 'ascending', `true` for 'descending'
   */
  setSort(sortColumn: string, sortReversed: boolean): void {
    this._listParams$.next(Object.assign({}, this._listParams$.value, {sortColumn, sortReversed}));
  }

  /**
   * Set the filter params all at once. If passed  `null`,
   * all the filterParams will be cleared.
   * @param  params  A map of `filterkey => filterValue`
   */
  setFilterParams(params: NgxListFilterParams | null) {
    const filterParams = params || {};
    this._listParams$.next(Object.assign({}, this._listParams$.value, {filterParams}));
  }

  /**
   * Seta a single filter param.
   */
  setFilterParam(filterKey: string, value: any) {
    const params = Object.assign({}, this._listParams$.value.filterParams);
    if (undefined !== value) {
      params[filterKey] = value;
    } else {
      delete params[filterKey];
    }
    this.setFilterParams(params);
  }

  /**
   * Initialization of the List.
   */
  private _init(init: NgxListInit) {
    this._filters = init.filters || [];
    this._sortFn = typeof init.sortFn === 'function' ? init.sortFn : NgxListSort.sortFn();
    const params = init.initialParams || {};
    const listParams: NgxListParams = {
      page: params.page || 0,
      recordsPerPage: params.recordsPerPage || 10,
      sortColumn: params.sortColumn || null,
      sortReversed: true === params.sortReversed,
      filterParams: params.filterParams || {}
    };
    this._listParams$ = new BehaviorSubject(listParams);
    this._paused$ = new BehaviorSubject(true === init.initiallyPaused);
    const initialResult: NgxListResult = {
      records: [], page: -1, recordCount: 0, pageCount: 0, unfilteredRecordCount: 0,
      recordsPerPage: listParams.recordsPerPage,
      sortColumn: listParams.sortColumn,
      sortReversed: listParams.sortReversed,
      filterParams: listParams.filterParams
    };
    this._result$ = new BehaviorSubject(initialResult);
    this._subscription = combineLatest(init.src$, this._listParams$.asObservable(), this._paused$.asObservable())
      .subscribe((results: [NgxListRecord[], NgxListParams, boolean]) => {
        this._update(...results);
      });
  }

  /**
   * Update the list when (1) the source records have changed,
   * (2) the list params have changed, or
   * (3) the list has been started or stopped.
   * @param  srcRecords The latest source records.
   * @param  listParams The new list params.
   * @param  paused     The latest paused state.
   */
  private _update(srcRecords: NgxListRecord[], listParams: NgxListParams, paused: boolean) {
    if (paused) {
      return;
    }
    const unfilteredRecordCount = srcRecords.length;
    const {filterParams, sortColumn, sortReversed} = listParams;

    let results = srcRecords.slice(0);
    this._filters.forEach((fn: NgxListFilterFn) => {
      results = fn(results, filterParams);
    });
    results = this._sortFn(results, sortColumn);
    if (sortReversed) {
      results.reverse();
    }
    const recordsPerPage = Math.max(0, listParams.recordsPerPage);
    const recordCount = results.length;
    const pages = recordsPerPage > 0 ? chunk(results, recordsPerPage) : [results];
    const pageCount = pages.length;
    const page = Math.min(pageCount - 1, Math.max(0, listParams.page));
    const records = pageCount > 0 ? pages[page] : [];
    const result: NgxListResult = {
      records, page, recordCount, pageCount, recordsPerPage, unfilteredRecordCount,
      filterParams, sortColumn, sortReversed
    };
    this._result$.next(result);
  }
}
