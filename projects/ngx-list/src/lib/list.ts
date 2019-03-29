import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { Helpers } from './helpers';
import { Sort } from './sort';
import {
  FilterFn,
  SortFn,
  Record,
  ListParams,
  ListInit,
  ListResult,
  ListInterface
} from './api';

export class List implements ListInterface {

  private _subscription: Subscription = null;
  private _listParams$: BehaviorSubject<ListParams>;
  private _paused$: BehaviorSubject<boolean>;
  private _result$: BehaviorSubject<ListResult>;
  private _filters: FilterFn[];
  private _sortFn: SortFn;


  constructor(init: ListInit) {
    this._init(init);
  }

  get results$(): Observable<ListResult> {
    return this._result$.asObservable();
  }

  get currentResult(): ListResult {
    return this._result$.value;
  }

  get records(): Record[] {
    return this.currentResult.records;
  }

  get page(): number {
    return this.currentResult.page;
  }

  get pageCount(): number {
    return this.currentResult.pageCount;
  }

  get recordsPerPage(): number {
    return this.currentResult.recordsPerPage;
  }

  get unfilteredRecordCount(): number {
    return this.currentResult.unfilteredRecordCount;
  }

  get filterParams(): {[filterKey: string]: any} {
    return this.currentResult.filterParams;
  }

  get sortColumn(): string {
    return this.currentResult.sortColumn;
  }

  get sortReversed(): boolean {
    return this.currentResult.sortReversed;
  }

  get paused(): boolean {
    return this._paused$.value;
  }

  get sortFn(): SortFn {
    return this._sortFn;
  }

  get filters(): FilterFn[] {
    return this._filters;
  }



  start() {
    this._paused$.next(false);
  }

  stop() {
    this._paused$.next(true);
  }

  destroy() {
    this._subscription.unsubscribe();
    this._paused$.complete();
    this._listParams$.complete();
    this._result$.complete();

  }


  setPage(page: number) {
    page = Math.min(0, page);
    this._listParams$.next(Object.assign({}, this._listParams$.value, {page}));
  }

  setRecordsPerPage(recordsPerPage: number) {
    recordsPerPage = Math.min(0, recordsPerPage);
    this._listParams$.next(Object.assign({}, this._listParams$.value, {recordsPerPage}));
  }

  setSort(sortColumn: string, sortReversed: boolean) {
    this._listParams$.next(Object.assign({}, this._listParams$.value, {sortColumn, sortReversed}));
  }

  setFilterParams(params: {[filterKey: string]: any} | null) {
    const filterParams = params || {};
    this._listParams$.next(Object.assign({}, this._listParams$.value, {filterParams}));
  }

  setFilterParam(filterKey: string, value: any) {
    const params = Object.assign({}, this._listParams$.value.filterParams);
    if (undefined !== value) {
      params[filterKey] = value;
    } else {
      delete params[filterKey];
    }
    this.setFilterParams(params);
  }


  private _init(init: ListInit) {
    this._filters = init.filters || [];
    this._sortFn = init.sortFn || Sort.sortFn();
    const params = init.initialParams || {};
    const listParams: ListParams = {
      page: params.page || 0,
      recordsPerPage: params.recordsPerPage || 10,
      sortColumn: params.sortColumn || null,
      sortReversed: true === params.sortReversed,
      filterParams: params.filterParams || {}
    };
    this._listParams$ = new BehaviorSubject(listParams);
    this._paused$ = new BehaviorSubject(true === init.initiallyPaused);
    const initialResult: ListResult = {
      records: [], page: 0, pageCount: 0, unfilteredRecordCount: 0,
      recordsPerPage: listParams.recordsPerPage,
      sortColumn: listParams.sortColumn,
      sortReversed: listParams.sortReversed,
      filterParams: listParams.filterParams
    };
    this._result$ = new BehaviorSubject(initialResult);
    this._subscription = combineLatest(init.src$, this._listParams$.asObservable(), this._paused$.asObservable())
      .subscribe((results: [Record[], ListParams, boolean]) => {
        this._update(...results);
      });
  }

  private _update(srcRecords: Record[], listParams: ListParams, paused: boolean) {
    if (paused) {
      return;
    }
    const unfilteredRecordCount = srcRecords.length;
    const {filterParams, sortColumn, sortReversed} = listParams;

    let results = srcRecords.slice(0);
    this._filters.forEach((fn: FilterFn) => {
      results = fn(results, filterParams);
    });
    results = this._sortFn(results, sortColumn);
    if (sortReversed) {
      results.reverse();
    }

    const recordsPerPage = Math.max(0, listParams.recordsPerPage);
    const pages = recordsPerPage > 0 ? Helpers.chunk(results, recordsPerPage) : [results];
    const pageCount = pages.length;
    const page = Math.min(pageCount - 1, Math.max(0, listParams.page));
    const records = pageCount > 0 ? pages[page] : [];
    const result: ListResult = {
      records, page, pageCount, recordsPerPage, unfilteredRecordCount,
      filterParams, sortColumn, sortReversed
    };
    this._result$.next(result);
  }
}
