import {
  NgxListFilterFn,
  NgxListRecord,
  NgxListFilterParams,
  NgxListColumnDefinition,
  NgxListValueFn
} from './shared';
export enum NgxListComparisonOperator {
  equals,
  gt,
  gte,
  lt,
  lte
}
import { NgxListHelpers } from './ngx-list-helpers';

export class NgxListFilterFactory {
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
        const strFn = NgxListHelpers.getColumnDefinition(columnKey, columnDefinitions).stringValueFn;
        const colValue: string = strFn(rec);
        if (colValue.indexOf(searchParam) > -1) {
          matched = true;
        }
      });
      return matched;
    };
    return fn;
  }
  static comparisonFilterFn(filterKey: string, operator: NgxListComparisonOperator): NgxListFilterFn {

  }
}
