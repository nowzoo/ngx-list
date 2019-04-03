import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxListBootstrapSortLinkComponent } from './sort-link/sort-link.component';
import { NgxListBootstrapSearchControlComponent } from './search-control/search-control.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PaginationSliderComponent } from './pagination-slider/pagination-slider.component';

@NgModule({
  declarations: [
    NgxListBootstrapSortLinkComponent,
    NgxListBootstrapSearchControlComponent,
    PaginationComponent,
    PaginationSliderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
  ],
  exports: [
    NgxListBootstrapSortLinkComponent,
    NgxListBootstrapSearchControlComponent,
    PaginationComponent,
    PaginationSliderComponent
  ]
})
export class NgxListBootstrapControlsModule { }
