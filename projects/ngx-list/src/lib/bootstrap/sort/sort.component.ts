import { Component, OnInit, OnDestroy, Input, Optional, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxList } from '../../list';
import { INgxListResult } from '../../shared';
import {
  INgxListBoostrapOptions,
  NGX_LIST_BOOTSTRAP_OPTIONS,
  NGX_LIST_BOOTSTRAP_DEFAULT_OPTIONS
} from '../options';

@Component({
  selector: 'ngx-list-bootstrap-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class NgxListBootstrapSortComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject();
  @Input() list: NgxList;
  @Input() key: string;
  @Input() defaultReversed = false;
  @Input() options: INgxListBoostrapOptions = null;
  selected = false;
  reversed = false;
  constructor(
    @Optional() @Inject(NGX_LIST_BOOTSTRAP_OPTIONS) private defaultOptions: INgxListBoostrapOptions
  ) { }

  ngOnInit() {
    this.list.result$
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(result => this.updateControl(result));
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  get normalizedOptions(): INgxListBoostrapOptions {
    return Object.assign(
      {},
      NGX_LIST_BOOTSTRAP_DEFAULT_OPTIONS,
      this.defaultOptions || {},
      this.options || {}
    );
  }

  select() {
    let reversed = this.defaultReversed;
    if (this.selected) {
      reversed = ! this.reversed;
    }
    this.list.setSort({key: this.key, reversed});
  }

  updateControl(result: INgxListResult) {
    this.selected = this.key === result.sort.key;
    if (this.selected) {
      this.reversed = result.sort.reversed;
    } else {
      this.reversed = false;
    }
  }

}
