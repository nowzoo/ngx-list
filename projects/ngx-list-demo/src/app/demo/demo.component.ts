import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {
  NgxList,
  NgxListCompare,
  NgxListInit,
  NgxListResult
 } from '@nowzoo/ngx-list';
import { DataService } from '../data.service';
import moment from 'moment';

enum ValueOptions {
  lessThan10 = 'less than $10',
  from10to25 = '$10 to $24.99',
  from25to50 = '$25 to $49.99',
  from50to100 = '$50 to $99.99',
  moreThan100 = 'more than $100',
}
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styles: []
})
export class DemoComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject();
  id = 'demo-component-';
  list: NgxList;
  result: NgxListResult = null;
  searchControl: FormControl;
  missingSelect: FormControl;
  purchasePriceSelect: FormControl;
  currentValueSelect: FormControl;
  valueOptions = Object.values(ValueOptions);


  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    const dollarValue = (value: number) => {
      if (value >= 100) {
        return ValueOptions.moreThan100;
      }
      if (value >= 50) {
        return ValueOptions.from50to100;
      }
      if (value >= 25) {
        return ValueOptions.from25to50;
      }
      if (value >= 10) {
        return ValueOptions.from10to25;
      }
      return ValueOptions.lessThan10;
    };




    const listInit: NgxListInit = {
      src$: this.dataService.data$,
      idKey: 'id',
      sortFn: NgxList.sortFn({
        caseSensitive: false,
        fallbackSortColumn: 'id',
        valueFns: {name: (rec: any) => `${rec.lastName} ${rec.firstName}`}
      }),
      filters: {
        search: NgxList.searchFilter({
          ignoredKeys: ['id'],
          valueFns: {
            'purchased.date': (rec) => moment(rec.purchased.date).format('LLLL'),
            lastWorn: (rec) => moment(rec.lastWorn).format('LLLL'),
          }
        }),
        missing: NgxList.comparisonFilter({
          value: (rec) => rec.missing ? rec.missing : 'none'
        }),
        purchasePrice:   NgxList.comparisonFilter({
          value: (rec) => dollarValue(rec.purchased.price)
        }),
        currentValue: NgxList.comparisonFilter({
          value: (rec) => dollarValue(rec.currentValue)
        }),

      }
    };
    this.list = new NgxList(listInit);
    this.list.results$
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(result => this.result = result);
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe(v => this.list.setFilterValue('search', v.trim()));
    this.missingSelect = new FormControl('');
    this.missingSelect.valueChanges.subscribe(v => this.list.setFilterValue('missing', v));
    this.purchasePriceSelect = new FormControl('');
    this.purchasePriceSelect.valueChanges.subscribe(v => this.list.setFilterValue('purchasePrice', v));
    this.currentValueSelect = new FormControl('');
    this.currentValueSelect.valueChanges.subscribe(v => this.list.setFilterValue('currentValue', v));

  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
    this.list.destroy();
  }


}
