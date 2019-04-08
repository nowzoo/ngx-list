import { Component, OnInit, Input} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { NgxListAbstractControl } from '../../control';



@Component({
  selector: 'ngx-list-bootstrap-page-controls',
  templateUrl: './page-controls.component.html',
  styleUrls: ['./page-controls.component.css']
})
export class PageControlsComponent extends NgxListAbstractControl implements OnInit {
  static ct = 0;
  @Input() bootstrapSize: 'sm' | 'lg' = null;
  id: string;
  pageOptions: {value: number, label: string}[] = [];
  ngOnInit() {
    super.ngOnInit();
    this.id = `ngx-list-bootstrap-page-controls-${++ PageControlsComponent.ct}`;
    this.list.results$
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(result => {
        const opts: {value: number, label: string}[] = [];
        if (result.pageCount > 0) {

          for (let n = 0; n < result.pageCount; n++) {
            opts.push({value: n, label: (n + 1).toString()});
          }
        } else {

          opts.push({value: null, label: '-'});
        }
        this.pageOptions = opts;
      });
  }

}
