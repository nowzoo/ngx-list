import { Input, HostListener } from '@angular/core';
import { NgxListAbstractControl } from './control';
export class NgxListAbstractSortLink extends NgxListAbstractControl {
  @Input() columnKey: string;
  @Input() defaultReversed = false;
  @HostListener('click', ['$event'])
  onClick(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    const reversed: boolean = this.result && this.result.sort.key === this.columnKey ?
      (! this.result.sort.reversed) : this.defaultReversed;
    this.list.setSort({key: this.columnKey, reversed});
  }
}
