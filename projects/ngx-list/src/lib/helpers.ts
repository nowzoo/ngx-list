export class Helpers {
  static isNullOrUndefined(value: any): boolean {
    return typeof value === 'undefined' || null === value;
  }
  static orNull(value: any): any {
    return Helpers.isNullOrUndefined(value) ? null : value;
  }

  static ensureTrimmedString(val: any): string {
    return typeof val === 'string' ? val.trim() : '';
  }
  static safeToString(val: any): string {
    return val !== undefined && val !== null  && typeof val.toString === 'function' ?
      val.toString() : '';
  }

  static get(obj: any, path: string, defaultValue?: any) {
    const keys = path.replace(/(\w+)\[(\d+)\]/g, '$1.$2').split('.');
    return keys.reduce((a, c) => (a && a[c] ? a[c] : (defaultValue || undefined)), obj);
  }

  static chunk(input: any[], size: number): any[][] {
    return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
    }, []);
  }

}
