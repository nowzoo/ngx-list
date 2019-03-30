import { OnInit, OnDestroy, Input } from '@angular/core';
import { NgxList } from '../list';
import { NgxListResult } from '../api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class NgxListAbstractControl implements OnInit, OnDestroy {
  protected _ngUnsubscribe: Subject<void> = new Subject();
  @Input() list: NgxList;
  result: NgxListResult = null;

  ngOnInit() {
    this.list.results$
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(result => {
        this.result = result;
      });
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
