import { Component, OnInit, Input } from '@angular/core';
import { NgxListAbstractControl } from '@nowzoo/ngx-list';

interface LinkInfo {
  page: number;
  label: string;
  content: string;
  current: boolean;
  disabled: boolean;
}
@Component({
  selector: 'app-pagination',
  templateUrl: 'pagination.component.html',
  styles: ['pagination.component.scss']
})
export class PaginationComponent extends NgxListAbstractControl implements OnInit {
  @Input() firstLast = true;
  @Input() prevNext = true;
  @Input() maxAdjacent = 3;
  @Input() firstPageLabel = 'First Page';
  @Input() lastPageLabel = 'Last Page';
  @Input() prevPageLabel = 'Previous Page';
  @Input() nextPageLabel = 'Next Page';

  ngOnInit() {
    super.ngOnInit();
  }

  onRangeChange(event: Event) {
    console.log((event as any).target.value);
    this.list.setPage(parseInt((event as any).target.value, 10));
  }

  onRangeInput(event: Event) {
    console.log((event as any).target.value);
  }



  // get links(): LinkInfo[] {
  //   // if (this.result.pageCount === 0) {
  //   //   return [];
  //   // }
  //   // const links = [{
  //   //   page: this.result.page,
  //   //   label: (this.result.page + 1).toString(),
  //   //   content: (this.result.page + 1).toString(),
  //   //   current: true
  //   // }];
  //   //
  //   // let otherPage: number;
  //   //
  //   // for (let n = 1; n <= this.maxAdjacent; n++) {
  //   //
  //   // }
  // }

  get firstLink(): LinkInfo[] {
    if (! this.firstLast) {
      return [];
    }
    if (this.result.pageCount <= 1) {
      return [];
    }
    return [{
      page: 0,
      content: '&laquo;',
      label: this.firstPageLabel,
      disabled: this.result.pageCount === 0,
      current: this.result.page === 0
    }];
  }

  get lastLink(): LinkInfo[] {
    if (! this.firstLast) {
      return [];
    }
    if (this.result.pageCount <= 1) {
      return [];
    }
    return [{
      page: 0,
      content: '&raquo;',
      label: this.lastPageLabel,
      disabled: this.result.pageCount === 0,
      current: this.result.page === 0
    }];
  }

  get prevAdjLinks(): LinkInfo[] {
    let otherPage: number;
    const links: LinkInfo[] = [];
    for (let n = 1; n <= this.maxAdjacent; n++) {
      otherPage = this.result.page - n;
      if (otherPage >= 0) {
        links.unshift({
          page: otherPage,
          content: (otherPage + 1).toString(),
          label: (otherPage + 1).toString(),
          current: false,
          disabled: false
        });
      }
    }
    return links;
  }
  get nextAdjLinks(): LinkInfo[] {
    let otherPage: number;
    const links: LinkInfo[] = [];
    for (let n = 1; n <= this.maxAdjacent; n++) {
      otherPage = this.result.page + n;
      if (otherPage < this.result.pageCount) {
        links.push({
          page: otherPage,
          content: (otherPage + 1).toString(),
          label: (otherPage + 1).toString(),
          current: false,
          disabled: false
        });
      }
    }
    return links;
  }



}
