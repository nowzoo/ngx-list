import { Component, OnInit, OnDestroy, Input, Optional, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, debounceTime, takeUntil } from 'rxjs/operators';
import { NgxList } from '../../list';
import { NgxListResult } from '../../shared';
import {
  INgxListBoostrapOptions,
  NGX_LIST_BOOTSTRAP_OPTIONS,
  NGX_LIST_BOOTSTRAP_DEFAULT_OPTIONS
} from '../options';


@Component({
  selector: 'ngx-list-bootstrap-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class NgxListBootstrapSearchComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject();
  @Input() list: NgxList;
  @Input() filterKey: string;
  @Input() debounce = 0;
  @Input() inputId: string;
  @Input() bootstrapSize: 'sm' | 'lg' = null;
  @Input() options: INgxListBoostrapOptions = null;
  control: FormControl;
  constructor(
    @Optional() @Inject(NGX_LIST_BOOTSTRAP_OPTIONS) private defaultOptions: INgxListBoostrapOptions
  ) { }

  ngOnInit() {
    this.control = new FormControl('');
    this.list.results$
      .pipe(take(1))
      .subscribe(result => {
        this.onFirstResult(result);
      });
  }
  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  onFirstResult(result: NgxListResult) {
    const val = result.filterValues && typeof result.filterValues[this.filterKey] === 'string' ?
      result.filterValues[this.filterKey] : '';
    this.control.setValue(val.trim());
    this.control.valueChanges
      .pipe(debounceTime(this.debounce))
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((value) => {
        this.onControlValueChange(value);
      });
  }

  onControlValueChange(value: string) {
    this.list.setFilterValue(this.filterKey, value.trim());
  }

  get normalizedOptions(): INgxListBoostrapOptions {
    return Object.assign(
      {},
      NGX_LIST_BOOTSTRAP_DEFAULT_OPTIONS,
      this.defaultOptions || {},
      this.options || {}
    );
  }


}
