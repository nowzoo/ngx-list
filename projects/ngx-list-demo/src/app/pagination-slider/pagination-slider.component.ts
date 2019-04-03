import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { NgxListAbstractControl } from '@nowzoo/ngx-list';
@Component({
  selector: 'app-pagination-slider',
  templateUrl: './pagination-slider.component.html',
  styleUrls: ['pagination-slider.component.scss'],

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


  onRangeChange(event: Event) {
    this.list.setPage(parseInt((event as any).target.value, 10));
    this.sliderPage = -1;
    this.sliding = false;
  }

  onRangeInput(event: Event) {
    this.sliderPage = parseInt((event as any).target.value, 10);
    this.sliding = true;
  }

}
