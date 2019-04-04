import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxListBootstrapSortLinkComponent } from './sort-link/sort-link.component';
import { NgxListBootstrapSearchControlComponent } from './search-control/search-control.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PaginationSliderComponent } from './pagination-slider/pagination-slider.component';
import { NgxListBootstrapRppControlComponent } from './rpp-control/rpp-control.component';
import { PageControlsComponent } from './page-controls/page-controls.component';

@NgModule({
  declarations: [
    NgxListBootstrapSortLinkComponent,
    NgxListBootstrapSearchControlComponent,
    PaginationComponent,
    PaginationSliderComponent,
    NgxListBootstrapRppControlComponent,
    PageControlsComponent
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
    PaginationSliderComponent,
    NgxListBootstrapRppControlComponent,
    PageControlsComponent
  ]
})
export class NgxListBootstrapControlsModule { }
