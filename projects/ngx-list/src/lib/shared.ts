import { Observable } from 'rxjs';

/**
 * What this library expects a record to look like.
 */
export interface NgxListRecord {
  [key: string]: any;
}

/**
 * The list maintains a map of filter params that
 * you can modify.
 */
export interface NgxListFilterParams {
  /**
   * The filterKey is something like `'search'` or `'color'`.
   * The value can be anything you choose to set.
   */
  [filterKey: string]: any;
}

/**
 * A function that, given a record and a column key,
 * returns the value of the key for purposes of sorting,
 * search or filtering.
 */
export type NgxListColumnValueFn = (record: NgxListRecord) => any;


/**
 * The signature of a filter functions. The function is passed a set of records
 * and the current `{@link NgxListFilterParams}` object. It should
 * return the records that match.
 *
 * Note that youy can use the `[comparisonFilter]{@link NgxListFilters#comparisonFilter}`
 * and `[searchFilter]{@link NgxListFilters#searchFilter}` factories to create filters,
 * or roll your own using this signature.
 */
export type NgxListFilterFn = (records: NgxListRecord[], filterParams: NgxListFilterParams) => NgxListRecord[];

/**
 * The signature of a sorting function.  You can use the [NgxListSort.sortFn]{@link NgxListSort#sortFn}
 * factory to craete this function, or roll your own.
 */
export type NgxListSortFn = (records: NgxListRecord[], sortColumn: string) => NgxListRecord[];

/**
 * Filter comparison types. Used by {@link NgxListFilters}
 */
export enum NgxListCompare {
  /**
   * Equals. `===`
   */
  eq = 1,
  /**
   * Not equal to. `!==`
   */
  neq,
  /**
   * Greater than or equal to.  `>=`
   */
  gte,
  /**
   * Greater than. `>`
   */
  gt,
  /**
   * Less than. `<`
   */
  lt,
  /**
   * Less than or equal to.  `<=`
   */
  lte
}

/**
 * The interface for creating a search filter
 * with the `[NgxListFilters.searchFilter]{@link NgxListFilters#searchFilter}`
 * factory.
 */
export interface NgxListSearchFilterOptions {
  /**
   * The key of the filter. This should be unique among your filters.
   */
  filterKey: string;
  /**
   * Optional. By default this is `false`: searches
   * will be performed case-insensitively.
   */
  caseSensitive?: boolean;
  /**
   * Optional. By default all of the top level
   * keys in a record object will be converted to strings
   * and searched. So a record like `{id: 123, profile: {}}`
   * would be matched by the search `'object'` because `profile.toString() === '[object Object]'`.
   * To avoid this, pass ['profile'] for `ignoreKeys`.
   */
  ignoreKeys?: string[];

  /**
   * A map of functions (`{[key: string]: NgxListColumnValueFn}`) that
   * return values for specific keys. For example, for purposes of search, you may want to represent a
   * date stored as an integer in more useful form. In that case you would pass something like
   * `{'profile.birthday': (record) => moment.format(record.profile.birthday, 'LL')}`
   */
  valueFns?: {[key: string]: NgxListColumnValueFn};
}

export interface NgxListCompareFilterOptions {
  filterKey: string;
  value: string | NgxListColumnValueFn;
  compare?: NgxListCompare;
  ignoreFilterWhen?: (filterValue: any) => boolean;
}

export interface NgxListSortFunctionOptions {
  fallbackSortColumn?: string;
  caseSensitive?: boolean;
  valueFns?: {[key: string]: NgxListColumnValueFn};
}

export interface NgxListParams {
 page: number;
 recordsPerPage: number;
 sortColumn: string;
 sortReversed: boolean;
 filterParams: NgxListFilterParams;
}


export interface NgxListInit {
  /**
   * Required. An observable of all the records in the list, unsorted and unfiltered.
   */
  src$: Observable<NgxListRecord[]>;

  /**
   * A list of filters. You can use the factory methods provided by
   * NgxListFilters or roll your own.
   * @see NgxListFilters
   * @see NgxListFilterFn
   */
  filters?: NgxListFilterFn[];
  /**
   * The sort function. By
   */
  sortFn?: NgxListSortFn;
  initialParams?: {
    page?: number;
    recordsPerPage?: number;
    sortColumn?: string;
    sortReversed?: boolean;
    filterParams?: NgxListFilterParams;
  };
  initiallyPaused?: boolean;
}

export interface NgxListResult {
  /**
   * The records that belong on the current page.
   */
  records: NgxListRecord[];
  /**
   * The current page number, zero-based.
   */
  page: number;
  /**
   * The number of pages.
   */
  pageCount: number;
  /**
   * The total number of records in the list, after the current filters are applied.
   */
  recordCount: number;
  /**
   * The number of records per page.
   */
  recordsPerPage: number;
  /**
   * the current sort column.
   */
  sortColumn: string;
  /**
   * Whether the list is currently sorted in reverse ('descending') order.
   */
  sortReversed: boolean;
  /**
   * The total number of records in the list, befor applying filters.
   */
  unfilteredRecordCount: number;
  /**
   * The current filter params.
   */
  filterParams: NgxListFilterParams;
}
