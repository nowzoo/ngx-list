import { Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { NgxListAbstractControl } from './control';
import { NgxListResult } from '../shared';
export class NgxListAbstractSearchControl extends NgxListAbstractControl implements OnInit {
  @Input() filterKey: string;
  @Input() debounce = 0;
  private _control: FormControl;
  get control(): FormControl {
    return this._control;
  }
  ngOnInit() {
    super.ngOnInit();
    this._control = new FormControl('');
    this.list.results$
      .pipe(take(1))
      .subscribe(result => {
        this.onFirstResult(result);
      });
  }

  onFirstResult(result: NgxListResult) {
    const val = result.filterParams && typeof result.filterParams[this.filterKey] === 'string' ?
      result.filterParams[this.filterKey] : '';
    this.control.setValue(val.trim());
    this.control.valueChanges
      .pipe(debounceTime(this.debounce))
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((value) => {
        this.onControlValueChange(value);
      });
  }

  onControlValueChange(value: string) {
    this.list.setFilterParam(this.filterKey, value.trim());
  }


}
