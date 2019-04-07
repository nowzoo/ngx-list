import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { NgxList, NgxListSort,
  NgxListCompare,
  NgxListFilters, NgxListInit, NgxListResult } from '@nowzoo/ngx-list';
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
export class DemoComponent implements OnInit {
  id = 'demo-component-';
  list: NgxList;
  result: NgxListResult = null;
  missingSelect: FormControl;
  purchasePriceSelect: FormControl;
  listFg: FormGroup;
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
    this.listFg = this.fb.group({
      page: [0],
      sortColumn: ['id'],
      sortReversed: [false],
      recordsPerPage: [10],
      filters: {
        search: [''],
        missing: [''],
        purchasePrice: [''],
        currentValue: ['']
      }
    });



    const listInit: NgxListInit = {
      src$: this.dataService.data$,
      initialParams: {
        sortColumn: 'id',
        recordsPerPage: 3,
        filterParams: {
          search: ''
        }
      },
      sortFn: NgxListSort.sortFn({
        caseSensitive: false,
        fallbackSortColumn: 'id',
        valueFns: {name: (rec: any) => `${rec.lastName} ${rec.firstName}`}
      }),
      filters: [
        NgxListFilters.searchFilter({
          filterKey: 'search',
          ignoreKeys: ['id'],
          valueFns: {
            'purchased.date': (rec) => moment(rec.purchased.date).format('LLLL'),
            lastWorn: (rec) => moment(rec.lastWorn).format('LLLL'),
          }
        }),
        NgxListFilters.comparisonFilter({
          filterKey: 'missing',
          value: (rec) => rec.missing ? rec.missing : 'none'
        }),
        NgxListFilters.comparisonFilter({
          filterKey: 'purchasePrice',
          value: rec => dollarValue(rec.purchased.price)
        }),
        NgxListFilters.comparisonFilter({
          filterKey: 'currentValue',
          value: rec => dollarValue(rec.currentValue)
        }),
      ]
    };
    this.list = new NgxList(listInit);
    this.list.results$.subscribe(result => this.result = result);
    this.missingSelect = new FormControl('');
    this.missingSelect.valueChanges.subscribe(v => this.list.setFilterParam('missing', v));
    this.purchasePriceSelect = new FormControl('');
    this.purchasePriceSelect.valueChanges.subscribe(v => this.list.setFilterParam('purchasePrice', v));

  }


}
