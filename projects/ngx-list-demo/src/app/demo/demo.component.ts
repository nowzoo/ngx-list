import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { NgxList, NgxListSort,
  NgxListCompare,
  NgxListFilters, NgxListInit, NgxListResult } from '@nowzoo/ngx-list';
import { DataService } from '../data.service';
import moment from 'moment';
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


  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    const valueFilter = (value: number) => {
      if (value >= 100) {
        return '>=100';
      }
      if (value >= 50) {
        return '>=50';
      }
      if (value >= 25) {
        return '>=25';
      }
      if (value >= 10) {
        return '>=10';
      }
      return '<10';
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
          inspectKeys: ['purchased.date', 'purchased.price'],
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
          value: (rec) => {
            return valueFilter(rec.purchased.price);
          }
        })
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
