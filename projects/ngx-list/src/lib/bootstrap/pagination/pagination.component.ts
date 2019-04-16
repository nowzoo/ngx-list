import { Component, OnInit, OnDestroy, Input, Optional, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  selector: 'ngx-list-bootstrap-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class NgxListBoostrapPaginationComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject();
  @Input() selectId: string;
  @Input() list: NgxList;
  @Input() buttonClass = 'btn btn-outline-secondary';
  @Input() bootstrapSize: 'sm' | 'lg' = null;
  @Input() options: INgxListBoostrapOptions = null;
  control: FormControl;
  pageNumbers: number[] = [];
  prevDisabled = true;
  nextDisabled = true;
  lastPage = 0;
  constructor(
    @Optional() @Inject(NGX_LIST_BOOTSTRAP_OPTIONS) private defaultOptions: INgxListBoostrapOptions
  ) { }

  ngOnInit() {
    this.control = new FormControl(0);
    this.control.valueChanges
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(val => this.list.setPage(val));
    this.updateControl(this.list.result);
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

  updateControl(result: INgxListResult) {
    const pageNumbers: number[] = [];
    for (let n = 0; n < result.pageCount; n++) {
      pageNumbers.push(n);
    }
    this.lastPage = result.pageCount - 1;
    this.pageNumbers = pageNumbers;
    this.control.setValue(result.page, {emitEvent: false});
    this.prevDisabled = 0 >= result.page;
    this.nextDisabled = result.page >= this.lastPage;
  }

}
