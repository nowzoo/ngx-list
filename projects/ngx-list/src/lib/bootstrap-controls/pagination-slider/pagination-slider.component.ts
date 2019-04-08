import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { NgxListAbstractControl } from '../../control';

@Component({
  selector: 'ngx-list-bootstrap-pagination-slider',
  templateUrl: './pagination-slider.component.html',
  styleUrls: ['./pagination-slider.component.scss']
})
export class PaginationSliderComponent extends NgxListAbstractControl implements OnInit {
  @Input() inputId: string;
  @ViewChild('pageInput') pageInputElementRef: ElementRef;
  sliderPage  = -1;
  sliding = false;
  pageInputValue = 0;

  get pageInput(): HTMLInputElement {
    return this.pageInputElementRef.nativeElement;
  }

  ngOnInit() {
    super.ngOnInit();
    this.list.results$.pipe(takeUntil(this._ngUnsubscribe)).subscribe(result => {
      setTimeout(() => {
        this.pageInput.value = (result.page).toString();
      });

    });

  }


  onRangeChange() {
    this.list.setPage(parseInt(this.pageInput.value, 10));
    this.sliderPage = -1;
    this.sliding = false;
  }

  onRangeInput() {
    this.sliderPage = parseInt(this.pageInput.value, 10);
    this.sliding = true;
  }

}
