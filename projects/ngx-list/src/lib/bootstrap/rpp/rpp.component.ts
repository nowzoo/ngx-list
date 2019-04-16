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
  selector: 'ngx-list-bootstrap-rpp',
  templateUrl: './rpp.component.html',
  styleUrls: ['./rpp.component.css']
})
export class NgxListBoostrapRppComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject();
  @Input() selectId: string;
  @Input() list: NgxList;
  @Input() bootstrapSize: 'sm' | 'lg' = null;
  @Input() options: INgxListBoostrapOptions = null;
  control: FormControl;

  constructor(
    @Optional() @Inject(NGX_LIST_BOOTSTRAP_OPTIONS) private defaultOptions: INgxListBoostrapOptions
  ) { }

  ngOnInit() {
    this.control = new FormControl(10);
    this.control.valueChanges
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(val => this.list.setRecordsPerPage(val));
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
    this.control.setValue(result.recordsPerPage, {emitEvent: false});
  }

}
