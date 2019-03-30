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
    const reversed: boolean = this.result && this.result.sortColumn === this.columnKey ?
      (! this.result.sortReversed) : this.defaultReversed;
    this.list.setSort(this.columnKey, reversed);
  }
}
