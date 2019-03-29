import {
  NgxListFilterFn,
  NgxListRecord,
  NgxListFilterParams,
  NgxListColumnDefinition,
  NgxListValueFn
} from './shared';
import { NgxListHelpers } from './ngx-list-helpers';
export class NgxListFactory {

  static searchFilterFn(filterKey: string): NgxListFilterFn {
    const fn: NgxListFilterFn = (
      rec: NgxListRecord,
      params: NgxListFilterParams,
      columnDefinitions: {[columnKey: string]: NgxListColumnDefinition}
    ): boolean => {
      const searchParam: string = NgxListHelpers.ensureTrimmedString(params[filterKey]);
      if (searchParam.length === 0) {
        return true;
      }
      let matched = false;
      Object.keys(rec).forEach((columnKey: string) => {
        let colValue: string;
        if (
          columnDefinitions[columnKey] &&
          columnDefinitions[columnKey].stringValueFn
          &&  'function' === typeof columnDefinitions[columnKey].stringValueFn) {
          colValue = columnDefinitions[columnKey].stringValueFn(rec);
        } else {
          colValue = NgxListHelpers.safeToString(rec[columnKey]);
        }
        if (colValue.indexOf(searchParam) > -1) {
          matched = true;
        }
      });
      return matched;
    };
    return fn;
  }

  static sortFn(
    records: NgxListRecord[],
    sortKey: string,
    reversed: boolean,
    columnDefinitions: {[columnKey: string]: NgxListColumnDefinition}
  ): NgxListRecord[] {
    const sorted = records.slice(0);

    const valueFn: NgxListValueFn = columnDefinitions[sortKey]  &&
      columnDefinitions[sortKey].valueFn &&
      'function' === typeof columnDefinitions[sortKey].valueFn ?
      columnDefinitions[sortKey].valueFn : (rec: NgxListRecord) => rec[sortKey];

    const sort = (a: NgxListRecord, b: NgxListRecord): number => {
      const av = valueFn(a) || null;
      const bv = valueFn(b) || null;
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
    sorted.sort(sort);
    if (reversed) {
      sorted.reverse();
    }
    return sorted;
  }
}
