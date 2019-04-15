import { Observable } from 'rxjs';
/**
 * What this library expects a record to look like.
 */
export interface NgxListRecord {
  [key: string]: any;
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
export type NgxListFilterFn = (records: NgxListRecord[], value: any) => NgxListRecord[];

/**
 * The signature of a sorting function.  You can use the [NgxListSort.sortFn]{@link NgxListSort#sortFn}
 * factory to craete this function, or roll your own.
 */
export type NgxListSortFn = (records: NgxListRecord[], sortKey: string) => NgxListRecord[];

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



export interface NgxListInit {
  /**
   * Required. An observable of your records.
   */
  src$: Observable<NgxListRecord[]>;
  /**
   *  Required. The key that should be used as the id for each record.
   */
  idKey: string;
  /**
   *  Optional. The initial page, zero-based.
   */
  page?: number;
  /**
   * Optional. Initial records per page. Default 10. Pass 0 for no paging.
   */
  recordsPerPage?: number;
  /**
   *  Optional. The initial sort params.
   */
  sort?: {
    /**
     *  Indicates the column by which the list is sorted. Defaults to `idKey`.
     */
    key?: string;
    /**
     * Indicates whether the list  is displayed in reverse ('desc') order. Default false.
     */
    reversed?: boolean;
  };
  /**
   * Optional. Initial filter values.
   */
  filterValues?: {[filterKey: string]: any};
  /**
   * A map of filters.
   */
  filters?: {[key: string]: NgxListFilterFn};
  /**
   * Optional. By default a sort function will be created for you with some sensible defaults.
   */
  sortFn?: NgxListSortFn;

}




export interface NgxListParams {
  /**
   * The current page. Zero-based.
   */
 page: number;
 /**
  * The number of records per page. 0 for no paging.
  */
 recordsPerPage: number;

 /**
  * The sort params.
  */
 sort: {
   /**
    * The key of the column, like 'name' or 'profile.firstName'
    */
   key: string;
   /**
    * Whether the list should be sorted in reverse (z-a) order
    */
   reversed: boolean;
 };
 /**
  * The current values of the filters
  */
 filterValues: {[key: string]: any};
}



export interface NgxListResult extends NgxListParams {
  /**
   * The records that belong on the current page.
   */
  records: NgxListRecord[];
  /**
   * The number of pages.
   */
  pageCount: number;
  /**
   * The total number of records in the list, after the current filters are applied.
   */
  recordCount: number;

  /**
   * The total number of records in the list, befor applying filters.
   */
  unfilteredRecordCount: number;

}
