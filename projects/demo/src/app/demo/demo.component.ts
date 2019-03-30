import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxList, NgxListSort, NgxListFilters, NgxListInit, NgxListResult } from '@nowzoo/ngx-list';
import { DataService, SockPair } from '../data.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styles: []
})
export class DemoComponent implements OnInit {
  id = 'demo-component-';
  list: NgxList;
  result: NgxListResult = null;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    const listInit: NgxListInit = {
      src$: this.dataService.data$,
      initialParams: {
        sortColumn: 'id'
      },
      sortFn: NgxListSort.sortFn({caseInsensitive: true, fallbackSortColumn: 'id'}),
      filters: [
        NgxListFilters.searchFilter({filterKey: 'search'})
      ]
    };
    this.list = new NgxList(listInit);
    this.list.results$.subscribe(result => this.result = result);
  }



}
