import { Observable } from 'rxjs';
export interface NgxListFilterParams {[filterKey: string]: any; }
export interface NgxListRecord {[key: string]: any; }

export type NgxListSortFn = (
  a: NgxListRecord,
  b: NgxListRecord,
  sortColumn: string,
  sortReversed: boolean,
  columns: NgxListColumnDefinition[]
) => number;

export type NgxListFilterFn = (
  rec: NgxListRecord,
  params: NgxListFilterParams,
  columns: NgxListColumnDefinition[]
) => boolean;

export type NgxListValueFn = (r: NgxListRecord) => any;
export type NgListStringValueFn = (r: NgxListRecord) => string;

export interface NgxListColumnDefinition {
  columnKey: string;
  valueFn?: NgxListValueFn;
  stringValueFn?: NgListStringValueFn;
}

export interface FilterDef {
  filterKey: string;
  filterFn: NgxListFilterFn;
}


export interface NgxListParams {
  page: number;
  recordsPerPage: number;
  sortColumn: string;
  sortReversed: boolean;
  filterParams: NgxListFilterParams;
}


export interface NgxListInit {
  records$: Observable<NgxListRecord[]>;
  columns: NgxListColumnDefinition[];
  filters?: {[filterKey: string]: NgxListFilterFn};
  initialParams?: NgxListParams;
}


export interface NgxListResult {
  readonly records: NgxListRecord[];
  readonly page: number;
  readonly pageCount: number;
  readonly recordCount: number;
  readonly totalRecordCount: number;
  readonly sortColumn: string;
  readonly sortReversed: boolean;
  readonly recordsPerPage: number;
  readonly filterParams: NgxListFilterParams;
}

export const ngxListSortFn: NgxListSortFn = (
  a: NgxListRecord, b: NgxListRecord, sortColumn: string
): number => {
  const av = a[sortColumn] || null;
  const bv = b[sortColumn] || null;
  // return 0 if both are null or undefined
  if (av === null && bv === null) {
    return 0;
  }
  // b is before a if a is null or undefined
  if (av === null) {
    return 1;
  }
  // a is before b if b is null or undefined
  if (bv === null) {
    return -1;
  }
  // both exist, proceed as normal...
  if (av === bv) {
    return 0;
  }
  return av > bv ? 1 : -1;
};





export interface INgxList {
  readonly result$: Observable<NgxListResult>;
  readonly result: NgxListResult;
  readonly page: number;
  readonly recordsPerPage: number;
  readonly sortColumn: string;
  readonly sortReversed: boolean;
  readonly filterParams: NgxListFilterParams;
  readonly columns: NgxListColumnDefinition[];
  readonly filters: {[filterKey: string]: NgxListFilterFn};
  readonly records$: Observable<NgxListRecord[]>;
  readonly initialParams: NgxListParams;
  destroy(): void;
  setPage(page: number): void;
  setRecordsPerPage(recordsPerPage: number): void;
  setSort(columnKey: string, reversed: boolean): void;
  setFilterParam(filterKey: string, value: any): void;
}
