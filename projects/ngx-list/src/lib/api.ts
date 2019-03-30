import { Observable } from 'rxjs';


export enum NgxListCompare {
  /**
   * NgxListCompare with ===
   */
  equals,
  /**
   * NgxListCompare with >=
   */
  gte,
  /**
   * NgxListCompare with >
   */
  gt,
  /**
   * NgxListCompare with <
   */
  lt,
  /**
   * NgxListCompare with <=
   */
  lte
}

export interface NgxListRecord {[key: string]: any; }

export type NgxListFilterFn = (records: NgxListRecord[], filterParams: {[filterKey: string]: any}) => NgxListRecord[];

export type NgxListSortFn = (records: NgxListRecord[], sortColumn: string) => NgxListRecord[];

/**
 * A function that, given a record and a column key,
 * returns the value of the key for purposes of comparison,
 * i.e. for sorting and filtering records.
 *
 * The function may return `undefined` for any column key.
 * In that case we fall back to:
 *  - for any value that is not a string, the raw value
 *  - the strings, the lowercased value
 */
export type NgxListColumnValueFn = (record: NgxListRecord) => any;


export interface NgxListSortFunctionOptions {

  /**
   * Optional. The column to use to sort records
   * that are equal by the the current sortKey.
   */
  fallbackSortColumn?: string;

  /**
   * Optional. Default true.
   * If true, and if both record values are strings, the sort will happen case-insensitively
   */
  caseInsensitive?: boolean;

  /**
   * Optional.
   * A map from column keys to functions that return the value to be sorted.
   * All values are compared as strings.
   */
  valueFns?: {[key: string]: NgxListColumnValueFn};

}



export interface NgxListSearchFilterOptions {
  /**
   * The key in filterParams. Set this with List.setFilterParam(filterKey: string, value: any)
   */
  filterKey: string;
  /**
   * Optional. Default true.
   *
   */
  caseInsensitive?: boolean;
  /**
   * Keys to ignore when searching
   */
  ignoreKeys?: string[];
  /**
   * Optional.
   * A map from column keys to functions that return a value to be searched.
   * All values are compared as strings.
   */
  valueFns?: {[key: string]: NgxListColumnValueFn};
}


export interface NgxListFilterOptions {
  /**
   * The key in filterParams. Set this with List.setFilterParam(filterKey: string, value: any)
   */
  filterKey: string;
  /**
   * The column to compare
   */
  columnKey: string;
  /**
   * Optional. Default: null.
   * The filter will not be run when filterParams[filterKey] is this value.
   * By default, this will happen when you set filterParams[filterKey] to null.
   */
  ignoreWhenFilterIs?: any;
  /**
   * Optional. Comparison operator.
   * Default: NgxListCompare.equals
   */
  compare?: NgxListCompare;
  /**
   * Optional. Function that returns the value to compare.
   */
  valueFn?: NgxListColumnValueFn;
  /**
   * Optional. Default false.
   * If set to true, all values are compared as case-insensitive strings
   */
  caseInsensitive?: boolean;
}


export interface NgxListParams {
  page: number;
  recordsPerPage: number;
  sortColumn: string;
  sortReversed: boolean;
  filterParams: {[filterKey: string]: any};
}

export interface NgxListInit {
  src$: Observable<NgxListRecord[]>;
  filters?: NgxListFilterFn[];
  sortFn?: NgxListSortFn;
  initialParams?: {
    page?: number;
    recordsPerPage?: number;
    sortColumn?: string;
    sortReversed?: boolean;
    filterParams?: {[filterKey: string]: any};
  };
  initiallyPaused?: boolean;
}

export interface NgxListResult {
  records: NgxListRecord[];
  page: number;
  pageCount: number;
  recordsPerPage: number;
  sortColumn: string;
  sortReversed: boolean;
  unfilteredRecordCount: number;
  filterParams: {[filterKey: string]: any};
}

export interface NgxListInterface {
  readonly results$: Observable<NgxListResult>;
  readonly currentResult: NgxListResult;
  readonly records: NgxListRecord[];
  readonly page: number;
  readonly pageCount: number;
  readonly recordsPerPage: number;
  readonly unfilteredRecordCount: number;
  readonly filterParams: {[filterKey: string]: any};
  readonly sortColumn: string;
  readonly sortReversed: boolean;
  readonly paused: boolean;
  readonly sortFn: NgxListSortFn;
  readonly filters: NgxListFilterFn[];
  start(): void;
  stop(): void;
  setPage(page: number): void;
  setRecordsPerPage(recordsPerPage: number): void;
  setSort(sortColumn: string, sortReversed: boolean): void;
  setFilterParams(params: {[filterKey: string]: any} | null): void;
  setFilterParam(filterKey: string, value: any): void;
}
