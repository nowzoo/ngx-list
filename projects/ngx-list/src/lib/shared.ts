import { Observable } from 'rxjs';


export enum Compare {
  /**
   * Compare with ===
   */
  equals,
  /**
   * Compare with >=
   */
  gte,
  /**
   * Compare with >
   */
  gt,
  /**
   * Compare with <
   */
  lt,
  /**
   * Compare with <=
   */
  lte
}

export interface Record {[key: string]: any; }

export type FilterFn = (records: Record[], filterParams: {[filterKey: string]: any}) => Record[];

export type SortFn = (records: Record[], sortColumn: string) => Record[];

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
export type ColumnValueFn = (record: Record) => any;


export interface SortFunctionOptions {

  /**
   * Optional. The column to use to sort records
   * that are equal by the the current sortKey.
   */
  fallbackSortKey?: string;

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
  valueFns?: {[key: string]: ColumnValueFn};

}



export interface SearchFilterOptions {
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
  valueFns?: {[key: string]: ColumnValueFn};
}


export interface FilterOptions {
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
   * Default: Compare.equals
   */
  compare?: Compare;
  /**
   * Optional. Function that returns the value to compare.
   */
  valueFn?: ColumnValueFn;
  /**
   * Optional. Default false.
   * If set to true, all values are compared as case-insensitive strings
   */
  caseInsensitive?: boolean;
}


export interface ListParams {
  page: number;
  recordsPerPage: number;
  sortColumn: string;
  sortReversed: boolean;
  filterParams: {[filterKey: string]: any};
}

export interface ListInit {
  src$: Observable<Record[]>;
  filters?: FilterFn[];
  sortFn?: SortFn;
  initialParams?: {
    page?: number;
    recordsPerPage?: number;
    sortColumn?: string;
    sortReversed?: boolean;
    filterParams?: {[filterKey: string]: any};
  };
  initiallyPaused?: boolean;
}

export interface ListResult {
  records: Record[];
  page: number;
  pageCount: number;
  recordsPerPage: number;
  sortColumn: string;
  sortReversed: boolean;
  unfilteredRecordCount: number;
  filterParams: {[filterKey: string]: any};
}

export interface ListInterface {
  readonly results$: Observable<ListResult>;
  readonly currentResult: ListResult;
  readonly records: Record[];
  readonly page: number;
  readonly pageCount: number;
  readonly recordsPerPage: number;
  readonly unfilteredRecordCount: number;
  readonly filterParams: {[filterKey: string]: any};
  readonly sortColumn: string;
  readonly sortReversed: boolean;
  readonly paused: boolean;
  start(): void;
  stop(): void;
  setPage(page: number): void;
  setRecordsPerPage(recordsPerPage: number): void;
  setSort(sortColumn: string, sortReversed: boolean): void;
  setFilterParams(params: {[filterKey: string]: any} | null): void;
  setFilterParam(filterKey: string, value: any): void;
}
