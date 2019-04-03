import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { NgxListAbstractControl } from '@nowzoo/ngx-list';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent extends  NgxListAbstractControl implements OnInit {
  @Input() inputId: string;
  @Input() prevNext = true;
  @Input() firstLast = true;
  @Input() maxAdjacent = 3;


  btns: number[] = [];




  ngOnInit() {
    super.ngOnInit();
    this.list.results$.pipe(takeUntil(this._ngUnsubscribe)).subscribe(result => {
      const btnsAfter = [];
      const btnsBefore = [];
      for (let n = 1; n <= this.maxAdjacent; n++) {
        if ((result.page - n) >= 0) {
          btnsBefore.unshift(result.page - n);
        }
        if ((result.page + n) <= (result.pageCount - 1)) {
          btnsAfter.push(result.page + n);
        }
      }

      if (btnsBefore.length < this.maxAdjacent && btnsAfter.length > 0) {
        const start = btnsAfter[btnsAfter.length - 1];
        for (let n = 1; n <= this.maxAdjacent - btnsBefore.length; n++) {
          if ((start + n)  <= (result.pageCount - 1)) {
            btnsAfter.push(start + n);
          }
        }
      } else {
        if (btnsAfter.length < this.maxAdjacent && btnsBefore.length > 0) {
          const start = btnsBefore[0];
          for (let n = 1; n <= this.maxAdjacent - btnsAfter.length; n++) {
            btnsBefore.unshift(start - n);
          }
        }
      }

      this.btns = [...btnsBefore, result.page, ...btnsAfter];
    });
  }

}
