import { Input, HostListener } from '@angular/core';
import { NgxListAbstractControl } from './control';

export class PageLink extends NgxListAbstractControl {
  @Input() page: number;

  @HostListener('click', ['$event'])
  onClick(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (this.disabled) {
      return;
    }
    this.list.setPage(this.page);
  }

  get disabled(): boolean {
    return this.result.pageCount - 1 < this.page || 0 > this.page;
  }
}
