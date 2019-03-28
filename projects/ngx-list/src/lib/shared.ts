export interface NgxListFilterParams {[key: string]: any;}
export interface NgxListRecord {[key: string]: any;}

export type NgxListSortFn = (a: NgxListRecord, b: NgxListRecord, sortKey: string) => number;
export type NgxListFilterFn = (rec: NgxListRecord, params: NgxListFilterParams) => boolean;

export interface NgxListParams {
  page: number;
  recordsPerPage: number;
  sortKey: string;
  sortReversed: boolean;
  filterParams: NgxListFilterParams;
}

export interface NgxListResult {
  records: NgxListRecord[];
  page: number;
  pageCount: number;
  recordCount: number;
  totalRecordCount: number;
  sortKey: string;
  sortReversed: boolean;
  recordsPerPage: number;
  filterParams: NgxListFilterParams;
}

export const ngxListSortFn: NgxListSortFn = (
  a: NgxListRecord, b: NgxListRecord,sortKey: string
): number => {
  const av = a[sortKey] || null;
  const bv = b[sortKey] || null;
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

export const ngxListSearchFn: NgxListFilterFn = (
  rec: NgxListRecord, params: NgxListFilterParams
): boolean => {
  const search = typeof params.search === 'string' ? params.search.trim() : '';
  if (search.length === 0) {
    return true;
  }
  let matches = false;
  Object.keys(rec).forEach((k: string) => {
    const value: string = rec[k] !== undefined && rec[k] !== null  && typeof rec[k].toString === 'function' ?
      rec[k].toString() : '';
    if (value.indexOf(search) > -1) {
      matches = true;
    }
  });
  return matches;
}

export const ngxListDefaultParams: NgxListParams = {
  page: 0,
  recordsPerPage: 10,
  sortKey: 'id',
  sortReversed: false,
  filterParams: {}
}
