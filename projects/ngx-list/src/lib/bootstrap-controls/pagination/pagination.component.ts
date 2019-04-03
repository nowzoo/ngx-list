import { Component, OnInit, Input, OnChanges, Inject, Optional} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { NgxListAbstractControl } from '../../abstract-controls/control';
import {
  NgxListPaginationLabels,
  NGX_LIST_PAGINATION_LABELS,
  ngxListPaginationLabels
} from '../options';




@Component({
  selector: 'ngx-list-bootstrap-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent extends  NgxListAbstractControl implements OnInit, OnChanges {
  @Input() labels: NgxListPaginationLabels = null;
  @Input() maxAdjacent = 3;
  @Input() bootstrapSize: 'sm' | 'lg' = null;
  @Input() prevNext = true;
  @Input() firstLast = true;
  btns: number[] = [];

  constructor(
    @Optional() @Inject(NGX_LIST_PAGINATION_LABELS) private defaultLabels: NgxListPaginationLabels
  ) {
    super();
  }

  get normalizedLabels(): NgxListPaginationLabels {
    return Object.assign({}, ngxListPaginationLabels, this.defaultLabels || {}, this.labels || {});
  }


  ngOnInit() {
    super.ngOnInit();
    this.list.results$.pipe(takeUntil(this._ngUnsubscribe)).subscribe(() => {
      this.updateButtons();
    });
  }
  ngOnChanges() {
    this.updateButtons();
  }

  setPage(p: number, event: Event) {
    event.preventDefault();
    this.list.setPage(p);
  }


  updateButtons() {
    const btnsAfter = [];
    const btnsBefore = [];
    const result = this.result;
    let n: number;
    let start: number;
    if ((! result) || result.pageCount === 0) {
      this.btns = [];
      return;
    }
    for (n = 1; n <= this.maxAdjacent; n++) {
      if ((result.page - n) >= 0) {
        btnsBefore.unshift(result.page - n);
      }
      if ((result.page + n) <= (result.pageCount - 1)) {
        btnsAfter.push(result.page + n);
      }
    }

    if (btnsBefore.length < this.maxAdjacent && btnsAfter.length > 0) {
      start = btnsAfter[btnsAfter.length - 1];
      for (n = 1; n <= this.maxAdjacent - btnsBefore.length; n++) {
        if ((start + n)  <= (result.pageCount - 1)) {
          btnsAfter.push(start + n);
        }
      }
    } else {
      if (btnsAfter.length < this.maxAdjacent && btnsBefore.length > 0) {
        start = btnsBefore[0];
        for (n = 1; n <= this.maxAdjacent - btnsAfter.length; n++) {
          btnsBefore.unshift(start - n);
        }
      }
    }

    this.btns = [...btnsBefore, result.page, ...btnsAfter];
  }

}
