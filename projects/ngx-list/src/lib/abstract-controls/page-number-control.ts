import { NgxListAbstractControl } from './control';

export class NgxListAbstractPageNumberControl extends NgxListAbstractControl {
  get pages(): {value: number, label: string}[] {
    const pages: {value: number, label: string}[] = [];
    for (let n = 0; n < this.result.pageCount; n++) {
      pages.push({value: n, label: (n + 1).toString()});
    }
    return pages;
  }
}
