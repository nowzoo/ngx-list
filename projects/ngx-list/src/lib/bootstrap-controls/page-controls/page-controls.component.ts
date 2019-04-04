import { Component, OnInit, Input, OnChanges, Inject, Optional} from '@angular/core';
import { takeUntil, take } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NgxListAbstractControl } from '../../abstract-controls/control';
import {
  NgxListPaginationLabels,
  NGX_LIST_PAGINATION_LABELS,
  ngxListPaginationLabels
} from '../options';

import { NgxListResult } from '../../shared';

@Component({
  selector: 'ngx-list-bootstrap-page-controls',
  templateUrl: './page-controls.component.html',
  styleUrls: ['./page-controls.component.css']
})
export class PageControlsComponent extends NgxListAbstractControl implements OnInit {
  static ct = 0;
  id: string;
  control: FormControl;
  ngOnInit() {
    super.ngOnInit();
    this.id = `ngx-list-bootstrap-page-controls-${++ PageControlsComponent.ct}`;
    this.control = new FormControl(0);
    this.list.results$
      .pipe(take(1))
      .subscribe(result => {
        this.onFirstResult(result);
      });
  }

  onFirstResult(result: NgxListResult) {
    this.control.setValue(result.page);
    this.control.valueChanges
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((value) => {
        this.onControlValueChange(value);
      });
  }

  onControlValueChange(value: number) {
    this.list.setPage(value);
  }

  get pageOptions(): {value: number, label: string}[] {
    const opts: {value: number, label: string}[] = [];
    if (this.result.pageCount > 0) {
      for (let n = 0; n < this.result.pageCount; n++) {
        opts.push({value: n, label: (n + 1).toString()});
      }
    } else {
      opts.push({value: null, label: '-'});
    }

    return opts;
  }

}
