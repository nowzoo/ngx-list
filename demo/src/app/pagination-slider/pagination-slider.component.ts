import { Component, OnInit, Input } from '@angular/core';
import { NgxListAbstractControl } from '@nowzoo/ngx-list';
@Component({
  selector: 'app-pagination-slider',
  templateUrl: './pagination-slider.component.html',
  styles: ['pagination-slider.component.scss']
})
export class PaginationSliderComponent extends NgxListAbstractControl {
  @Input() inputId: string;
  sliderPage  = -1;
  sliderPageLeft = 0;

  onRangeChange(event: Event) {
    console.log(event);
    this.list.setPage(parseInt((event as any).target.value, 10));
    this.sliderPage = -1;
  }

  onRangeInput(event: Event) {
    console.log((event as any).target.value);
    this.sliderPage = parseInt((event as any).target.value, 10);
    this.sliderPageLeft = this.sliderPage / this.list.pageCount;
  }

}
