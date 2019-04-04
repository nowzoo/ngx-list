import { Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { NgxListAbstractControl } from './control';
import { NgxListResult } from '../shared';

export class NgxListAbstractRppControl extends NgxListAbstractControl implements OnInit {

  private _control: FormControl;
  get control(): FormControl {
    return this._control;
  }
  ngOnInit() {
    super.ngOnInit();
    this._control = new FormControl(10);
    this.list.results$
      .pipe(take(1))
      .subscribe(result => {
        this.onFirstResult(result);
      });
  }

  onFirstResult(result: NgxListResult) {
    this.control.setValue(result.recordsPerPage);
    this.control.valueChanges
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((value) => {
        this.onControlValueChange(value);
      });
  }

  onControlValueChange(value: number) {
    this.list.setRecordsPerPage(value);
  }


}
