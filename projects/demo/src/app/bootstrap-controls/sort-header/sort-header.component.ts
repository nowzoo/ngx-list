import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import * as NgxList from '@nowzoo/ngx-list';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-sort-header',
  templateUrl: './sort-header.component.html',
  styleUrls: ['./sort-header.component.scss']
})
export class SortHeaderComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject();
  @Input() list: NgxList.List;
  @Input() columnKey: string;
  @Input() defaultReversed = false;
  result: NgxList.ListResult = null;

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.preventDefault();
    const reversed: boolean = this.result && this.result.sortColumn === this.columnKey ?
      (! this.result.sortReversed) : this.defaultReversed;
    this.list.setSort(this.columnKey, reversed);
  }


  constructor() { }

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
