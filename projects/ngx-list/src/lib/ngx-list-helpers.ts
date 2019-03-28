import {
  NgxListFilterFn,
  NgxListRecord,
  NgxListFilterParams,
  NgxListColumnDefinition,
  NgxListValueFn,
  NgListStringValueFn
} from './shared';

export class NgxListHelpers {
  static ensureTrimmedString(val: any): string {
    return typeof val === 'string' ? val.trim() : '';
  }
  static safeToString(val: any): string {
    return val !== undefined && val !== null  && typeof val.toString === 'function' ?
      val.toString() : '';
  }

  static getColumnDefinition(
    columnKey: string,
    columnDefinitions: {[columnKey: string]: NgxListColumnDefinition}
  ): NgxListColumnDefinition {
    const def: NgxListColumnDefinition = columnDefinitions[columnKey] || {};
    if ((! def.stringValueFn) || ('function' !== typeof def.stringValueFn)) {
      def.stringValueFn = (r: NgxListRecord) => NgxListHelpers.safeToString(r[columnKey]);
    }
    if ((! def.valueFn) || ('function' !== typeof def.valueFn)) {
      def.valueFn = (r: NgxListRecord) => r[columnKey];
    }
    return def;
  }
}
