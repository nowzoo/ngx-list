import { Observable } from 'rxjs';



/**
 * A function that, given a record, returns a value for purposes of
 * sorting, search or filtering. Used by the factory functions.
 */
export type NgxListColumnValueFn = (record: any) => any;

export type NgxListFilterFn = (records: any[], value: any) => any[];

export type NgxListSortFn = (records: any[], sortKey: string) => any[];

/**
 * Filter comparison types.
 */
export enum NgxListCompare {
  eq = 1, // Use === for comparison.
  neq, // Use !== for comparison.
  gte, // Use >= for comparison.
  gt, // Use > for comparison.
  lt, // Use < for comparison.
  lte // Use =< for comparison.
}



export interface INgxListInit {
  /**
   * Required. An observable of your records.
   */
  src$: Observable<any[]>;
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




export interface INgxListParams {
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


/**
 * The end product of a list.
 */

export interface INgxListResult extends INgxListParams {
  /**
   * The records that belong on the current page.
   */
  records: any[];
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
