import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as NgxList from '@nowzoo/ngx-list';
import { DataService, SockPair } from '../data.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styles: []
})
export class DemoComponent implements OnInit {

  list: NgxList.List;
  result: NgxList.ListResult = null;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    const listInit: NgxList.ListInit = {
      src$: this.dataService.data$,
      initialParams: {
        sortColumn: 'id'
      },
      sortFn: NgxList.Sort.sortFn({caseInsensitive: true, fallbackSortColumn: 'id'}),
      filters: [

      ]
    };
    this.list = new NgxList.List(listInit);
    this.list.results$.subscribe(result => this.result = result);
  }



}
