import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import toSafeInteger from 'lodash-es/toSafeInteger';
import chunk from 'lodash-es/chunk';
import {
  NgxListResult,
  NgxListRecord,
  NgxListParams,
  NgxListSortFn,
  NgxListFilterFn,
  NgxListFilterParams,
  ngxListSortFn,
  ngxListDefaultParams
} from './shared';
export class NgxList {
  private _sub: Subscription = null;
  private _paused = true;
  private _result$: BehaviorSubject<NgxListResult>;
  private _records$: Observable<NgxListRecord[]>;
  private _params$: BehaviorSubject<NgxListParams>;
  private _sortFn: NgxListSortFn;
  private _filterFns: NgxListFilterFn[];

  constructor(
    records$: Observable<NgxListRecord[]>,
    initialParams: NgxListParams = ngxListDefaultParams,
    sortFn: NgxListSortFn = ngxListSortFn,
    filterFns: NgxListFilterFn[] = []
  ) {
    this._result$ = new BehaviorSubject({
      records: [],
      page: 0,
      pageCount: 0,
      recordCount: 0,
      totalRecordCount: 0,
      sortKey: initialParams.sortKey,
      sortReversed: initialParams.sortReversed,
      recordsPerPage: initialParams.recordsPerPage,
      filterParams: initialParams.filterParams
    });
    this._records$ = records$;
    this._params$ = new BehaviorSubject(initialParams);
    this._sortFn = sortFn;
    this._filterFns = filterFns;
  }



  private update(allRecords: NgxListRecord[], params: NgxListParams) {
    let results: NgxListRecord[] = allRecords.slice(0);
    this._filterFns.forEach(filterFn => {
      results = results.filter(rec => {
        return filterFn(rec, params.filterParams);
      });
    });
    results.sort((a: NgxListRecord, b: NgxListRecord) => {
      return this._sortFn(a, b, params.sortKey);
    });
    if (params.sortReversed) {
      results.reverse();
    }
    const recordCount = results.length;
    const recordsPerPage = Math.max(0, toSafeInteger(params.recordsPerPage));
    const pagedRecords: NgxListRecord[][] = recordsPerPage > 0 ? chunk(results, recordsPerPage) : [results.slice(0)];
    const pageCount = pagedRecords.length;
    const page = Math.max(Math.min(toSafeInteger(params.page), pageCount - 1), 0);
    const records: NgxListRecord[] = recordCount > 0 ? pagedRecords[page] : [];
    const result: NgxListResult = {
      records, page, pageCount, recordCount, recordsPerPage,
      totalRecordCount: allRecords.length,
      sortKey: params.sortKey,
      sortReversed: params.sortReversed,
      filterParams: params.filterParams
    };
    this._result$.next(result);
  }

  start() {
    if (this._sub) {
      this.stop();
    }
    this._paused = false;
    this._sub = combineLatest(
      this._records$,
      this._params$.asObservable()
    ).subscribe((results: [NgxListRecord[], NgxListParams]) => {
      this.update(results[0], results[1]);
    });
  }

  stop() {
    if (this._sub) {
      this._sub.unsubscribe();
      this._sub = null;
      this._paused = true;
    }
  }

  get result$(): Observable<NgxListResult> {
    return this._result$.asObservable();
  }

  get result(): NgxListResult {
    return this._result$.value;
  }

  get params(): NgxListParams {
    return this._params$.value;
  }

  get page(): number {
    return this.result.page;
  }

  set page(n: number) {
    this._params$.next(Object.assign({}, this.params, {page: n}));
  }

  get recordsPerPage(): number {
    return this.result.recordsPerPage;
  }

  set recordsPerPage(n: number) {
    this._params$.next(Object.assign({}, this.params, {recordsPerPage: n}));
  }

  get sortKey(): string {
    return this.result.sortKey;
  }

  set sortKey(s: string) {
    this._params$.next(Object.assign({}, this.params, {sortKey: s}));
  }

  get sortReversed(): boolean {
    return this.result.sortReversed;
  }

  set sortReversed(b: boolean) {
    this._params$.next(Object.assign({}, this.params, {sortReversed: b}));
  }

  get filterParams(): NgxListFilterParams {
    return this.result.filterParams;
  }

  set filterParams(o: NgxListFilterParams) {
    this._params$.next(Object.assign({}, this.params, {filterParams: o}));
  }

  get paused(): boolean {
    return this._paused;
  }

  set paused(b: boolean) {
    if (b) {
      this.stop();
    } else {
      this.start();
    }
  }

}
